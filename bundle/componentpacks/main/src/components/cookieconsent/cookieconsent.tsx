import { styles, definition, api } from "@uesio/ui"

import { useEffect } from "react"

import "vanilla-cookieconsent/dist/cookieconsent.css"
import * as CookieConsent from "vanilla-cookieconsent"

type ComponentDefinition = {
  title?: string
  description?: string
  preferencesTitle?: string
  preferencesDescription?: string
  moreInformationText?: string
}

type ConsentState = {
  categories: Record<string, string>
}

const Component: definition.UC<ComponentDefinition> = (props) => {
  const { context } = props
  const {
    title,
    description,
    preferencesTitle,
    preferencesDescription,
    moreInformationText,
  } = props.definition

  styles.add(context, {
    "div#cc-main": {
      "--cc-btn-primary-bg": "black",
      "--cc-font-family": "Roboto",
      "--cc-modal-border-radius": ".4rem",
      "--cc-btn-border-radius": "0",
    },
    "div#cc-main .cm__btn,div#cc-main .pm__btn": {
      "font-weight": 300,
      "font-size": "14px",
    },
  })

  const componentId = api.component.getComponentIdFromProps(props)

  const [, setState] = api.component.useState<ConsentState>(componentId)

  useEffect(() => {
    CookieConsent.run({
      onConsent: function () {
        // Create empty Record
        const categories: Record<string, boolean> = {}

        // Add the array values into the Record
        CookieConsent.getCookie("categories").forEach((val) => {
          categories[val] = true
        })
        setState({
          categories,
        })
      },
      categories: {
        necessary: {
          enabled: true, // this category is enabled by default
          readOnly: true, // this category cannot be disabled
        },
        analytics: {},
      },

      language: {
        default: "en",
        translations: {
          en: {
            consentModal: {
              title: title || "We use cookies",
              description: description || "Cookie modal description",
              acceptAllBtn: "Accept all",
              acceptNecessaryBtn: "Reject all",
              showPreferencesBtn: "Manage Individual preferences",
            },
            preferencesModal: {
              title: "Manage cookie preferences",
              acceptAllBtn: "Accept all",
              acceptNecessaryBtn: "Reject all",
              savePreferencesBtn: "Accept current selection",
              closeIconLabel: "Close modal",
              sections: [
                {
                  title: preferencesTitle || "Somebody said ... cookies?",
                  description: preferencesDescription || "I want one!",
                },
                {
                  title: "Strictly Necessary cookies",
                  description:
                    "These cookies are essential for the proper functioning of the website and cannot be disabled.",

                  //this field will generate a toggle linked to the 'necessary' category
                  linkedCategory: "necessary",
                },
                {
                  title: "Performance and Analytics",
                  description:
                    "These cookies collect information about how you use our website. All of the data is anonymized and cannot be used to identify you.",
                  linkedCategory: "analytics",
                },
                {
                  title: "More information",
                  description:
                    moreInformationText ||
                    'For any queries in relation to my policy on cookies and your choices, please <a href="#contact-page">contact us</a>',
                },
              ],
            },
          },
        },
      },
    })
  }, [
    title,
    description,
    preferencesTitle,
    preferencesDescription,
    moreInformationText,
  ])
  return null
}

export default Component
