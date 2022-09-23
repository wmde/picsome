import React, { useState, MouseEvent, ReactNode, KeyboardEvent } from "react"
import classNames from "classnames"
import styles from "./Autocomplete.module.scss"
import { Tag } from "./Tag"
import { SearchIcon, DeleteX, PlusIcon, NewlineIcon } from "./Icons"
import { T } from "@transifex/react"
import { fetchSuggestions, WikidataItem } from "../services/wikidata"
import { useRouter } from "blitz"
import { useUniqueId } from "../hooks/useUniqueId"
import { useDebouncedCallback } from "use-debounce"

export type AutocompleteProps = Omit<
  React.ComponentPropsWithoutRef<"input">,
  "value" | "onChange" | "type"
> & {
  value?: WikidataItem[]
  onChange: (newValue: WikidataItem[]) => void
  single?: boolean
  leadModifier?: boolean
  secondary?: boolean
  icon?: ReactNode
}

export const Autocomplete = (props: AutocompleteProps) => {
  const {
    value,
    onChange,
    single = false,
    leadModifier,
    icon,
    placeholder,
    secondary,
    ...inputProps
  } = props
  const router = useRouter()

  // Text input
  const [input, setInput] = useState("")

  // Autocomplete suggestions
  const [suggestions, setSuggestions] = useState<WikidataItem[]>([])
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(0)

  const labelId = useUniqueId()
  const selectedTags = value || []
  const isEmpty = input.length > 0 || selectedTags.length > 0

  // Clear input
  const clearInput = (event?: MouseEvent) => {
    event && event.preventDefault()
    setInput("")
    setSelectedSuggestionIndex(0)
    return true
  }

  const selectTag = (tag: WikidataItem) => {
    clearInput()
    if (single) {
      onChange([tag])
    } else {
      onChange(selectedTags.filter((selectedTag) => selectedTag.id !== tag.id).concat([tag]))
    }
  }

  const debouncedSuggestionsCall = useDebouncedCallback(async (input: string) => {
    const [suggestions, error] = await fetchSuggestions({
      language: router.locale || "de",
      search: input,
    })

    setSuggestions(suggestions)
    setSelectedSuggestionIndex(0)
    if (error) {
      console.error(error)
    }
  }, 250)

  const onInputChange = (input: string) => {
    setInput(input)
    debouncedSuggestionsCall(input)
  }

  const onInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    switch (event.key) {
      case "Enter":
        if (!single && input === "" && selectedTags.length > 0) {
          // Pressing enter when the input is empty submits the search
          event.preventDefault()
          onChange(selectedTags)
        } else if (input.length > 0 && suggestions.length > 0) {
          // Pressing enter when suggestions are visible adds the selected one
          // to the selected tags
          const selectedSuggestion = suggestions[selectedSuggestionIndex]
          if (selectedSuggestion) {
            event.preventDefault()
            selectTag(selectedSuggestion)
          }
        }
        break

      case "Backspace":
        if (input === "" && selectedTags.length > 0) {
          event.preventDefault()
          onChange(selectedTags.slice(0, -1))
        }
        break

      case "ArrowDown":
        if (selectedSuggestionIndex < suggestions.length) {
          event.preventDefault()
          setSelectedSuggestionIndex(selectedSuggestionIndex + 1)
        }
        break

      case "ArrowUp":
        if (selectedSuggestionIndex > 0) {
          event.preventDefault()
          setSelectedSuggestionIndex(selectedSuggestionIndex - 1)
        }
        break
    }
  }

  const renderSuggestions = () => {
    const hasInput = !!input
    if (!hasInput) {
      return null
    }
    return (
      <>
        {suggestions && suggestions.length > 0 && (
          <ul className={styles.suggestions}>
            {suggestions.map((suggestion: WikidataItem, index: number) => (
              <li
                key={suggestion.id}
                className={classNames(styles.item, {
                  [styles.item__focus as string]: selectedSuggestionIndex === index,
                })}
                onClick={(event) => {
                  event.preventDefault()
                  selectTag(suggestion)
                }}
              >
                <span className={styles.suggestionShortcut}>
                  <T _str="Enter" />
                  <NewlineIcon />
                </span>
                <span className={styles.suggestionLabel}>{suggestion.label}</span>
                <span className={styles.suggestionDescription}>{suggestion.description}</span>
              </li>
            ))}
          </ul>
        )}
      </>
    )
  }

  return (
    <div
      className={classNames(styles.autocomplete, {
        [styles.autocompleteLead as string]: leadModifier,
        [styles.secondary as string]: secondary,
      })}
    >
      <div className={styles.search}>
        <div className={styles.lead}>{!!icon ? icon : <SearchIcon />}</div>
        {isEmpty && (
          <div className={styles.trail}>
            <button
              className={styles.delete}
              onClick={(event) => {
                event.preventDefault()
                clearInput()
                onChange([])
              }}
            >
              <DeleteX />
            </button>
          </div>
        )}
        <div className={styles.field}>
          <ul className={styles.tags}>
            {selectedTags.map((tag, index) => (
              <li className={styles.tag} key={index}>
                <Tag
                  item={tag}
                  onDelete={(event) => {
                    onChange(selectedTags.filter((selectedTag) => selectedTag.id !== tag.id))
                  }}
                />
              </li>
            ))}
          </ul>
          <div className={styles.inputWrapper}>
            <input
              id={labelId}
              type="text"
              onKeyDown={onInputKeyDown}
              value={input}
              className={styles.input}
              onChange={(e) => {
                onInputChange(e.currentTarget.value)
              }}
              {...inputProps}
            />
            {selectedTags.length > 0 && (
              <div className={styles.additionalPlaceholder}>
                <PlusIcon />
                <span className={styles.additionalPlaceholderLabel}>
                  <T _str="Weitere Tags" />
                </span>
              </div>
            )}
          </div>
        </div>
        <label
          htmlFor={labelId}
          className={classNames(styles.placeholder, {
            [styles.placeholderHidden as string]: isEmpty,
          })}
        >
          {placeholder}
        </label>
      </div>
      {renderSuggestions()}
    </div>
  )
}

export default Autocomplete
