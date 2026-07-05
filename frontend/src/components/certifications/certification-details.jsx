import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field"

import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

import FileUploadComponent from "./file-upload.jsx"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { industries } from "@/constants/industries.js"
import { getFileViewUrl } from "@/services/fileService.js"

const MIN_PRICE = 99
const MIN_TITLE_LENGTH = 3
const MAX_TITLE_LENGTH = 150
const MIN_DESCRIPTION_LENGTH = 20
const MAX_DESCRIPTION_LENGTH = 300

function CertificationDetails({ value, onChange, errors = {} }) {
  function updateField(fieldName, fieldValue) {
    onChange({
      ...value,
      [fieldName]: fieldValue,
    })
  }

  function handlePriceChange(event) {
    const nextPrice = event.target.value

    const validTypingPattern = /^\d*(?:\.\d{0,2})?$/

    if (validTypingPattern.test(nextPrice)) {
      updateField("price", nextPrice)
    }
  }

  return (
      <FieldSet className="w-full">
        <FieldGroup className="gap-5">
          {}
          <Field>
            <FieldLabel htmlFor="certification-title">
              Certification Name
            </FieldLabel>

            <Input
                id="certification-title"
                type="text"
                value={value.title ?? ""}
                minLength={MIN_TITLE_LENGTH}
                maxLength={MAX_TITLE_LENGTH}
                onChange={(event) => {
                  updateField("title", event.target.value)
                }}
                placeholder="Example: IT Passport Certification"
                aria-invalid={Boolean(errors.title)}
                aria-describedby={
                  errors.title
                      ? "certification-title-error"
                      : "certification-title-description"
                }
            />

            <FieldDescription id="certification-title-description">
              Use at least {MIN_TITLE_LENGTH} characters and no more than{" "}
              {MAX_TITLE_LENGTH} characters.
            </FieldDescription>

            {errors.title && (
                <FieldError id="certification-title-error">
                  {errors.title}
                </FieldError>
            )}
          </Field>

          <FieldGroup className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {}
            <Field>
              <FieldLabel htmlFor="certification-price">
                Price
              </FieldLabel>

              <Input
                  id="certification-price"
                  type="text"
                  inputMode="decimal"
                  autoComplete="off"
                  maxLength={12}
                  value={value.price ?? ""}
                  onChange={handlePriceChange}
                  placeholder="599.00"
                  aria-invalid={Boolean(errors.price)}
                  aria-describedby={
                    errors.price
                        ? "certification-price-error"
                        : "certification-price-description"
                  }
              />

              <FieldDescription id="certification-price-description">
                Minimum price is ₱{MIN_PRICE}. Use numbers only, such as 99 or
                599.00.
              </FieldDescription>

              {errors.price && (
                  <FieldError id="certification-price-error">
                    {errors.price}
                  </FieldError>
              )}
            </Field>

            {}
            <Field>
              <FieldLabel htmlFor="certification-industry">
                Industry
              </FieldLabel>

              <Select
                  value={value.industry ?? ""}
                  onValueChange={(selectedIndustry) => {
                    updateField("industry", selectedIndustry)
                  }}
              >
                <SelectTrigger
                    id="certification-industry"
                    className="w-full"
                    aria-invalid={Boolean(errors.industry)}
                    aria-describedby={
                      errors.industry
                          ? "certification-industry-error"
                          : undefined
                    }
                >
                  <SelectValue placeholder="Select an industry" />
                </SelectTrigger>

                <SelectContent>
                  {industries.map((industry) => (
                      <SelectItem key={industry} value={industry}>
                        {industry}
                      </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {errors.industry && (
                  <FieldError id="certification-industry-error">
                    {errors.industry}
                  </FieldError>
              )}
            </Field>
          </FieldGroup>

          <Field>
            <FieldLabel htmlFor="certification-description">
              Description
            </FieldLabel>

            <Textarea
                id="certification-description"
                value={value.description ?? ""}
                minLength={MIN_DESCRIPTION_LENGTH}
                maxLength={MAX_DESCRIPTION_LENGTH}
                onChange={(event) => {
                  updateField("description", event.target.value)
                }}
                placeholder="Write a short description about this certification review."
                className="min-h-28 resize-y"
                aria-invalid={Boolean(errors.description)}
                aria-describedby={
                  errors.description
                      ? "certification-description-error"
                      : "certification-description-help"
                }
            />

            <div className="flex items-center justify-between gap-3">
              <FieldDescription id="certification-description-help">
                Explain what learners will study in this review. Minimum:{" "}
                {MIN_DESCRIPTION_LENGTH} characters.
              </FieldDescription>

              <span className="shrink-0 text-xs text-muted-foreground">
              {(value.description ?? "").length}/{MAX_DESCRIPTION_LENGTH}
            </span>
            </div>

            {errors.description && (
                <FieldError id="certification-description-error">
                  {errors.description}
                </FieldError>
            )}
          </Field>

          {}
          <Field>
            <FieldLabel>Certification Cover Image</FieldLabel>

            <FileUploadComponent
                value={value.imageFile}
                error={errors.imageFile}
                imageUrl={
                  value.existingImageKey
                      ? getFileViewUrl(value.existingImageKey)
                      : ""
                }
                onChange={(file) => {
                  updateField("imageFile", file)
                }}
            />

            <FieldDescription>
              Upload a JPG, JPEG, PNG, or WEBP image. Maximum file size: 5 MB.
            </FieldDescription>

            {}
            {errors.imageFile && (
                <FieldError>{errors.imageFile}</FieldError>
            )}
          </Field>
        </FieldGroup>
      </FieldSet>
  )
}

export default CertificationDetails