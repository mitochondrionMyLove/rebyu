import React from "react"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import FileUploadComponent from "./file-upload"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {industries} from "@/constants/industries.js";

function CertificationDetails({ value, onChange, errors = {} }) {
  const updateField = (fieldName, fieldValue) => {
    onChange({
      ...value,
      [fieldName]: fieldValue,
    })
  }

  return (
    <FieldSet className="w-full">
      <FieldGroup className="gap-5">
        <Field>
          <FieldLabel htmlFor="certification-title">
            Certification Name
          </FieldLabel>

          <Input
            id="certification-title"
            value={value.title ?? ""}
            onChange={(event) => updateField("title", event.target.value)}
            placeholder="Example: IT Passport Certification"
            aria-invalid={Boolean(errors.title)}
          />

          {errors.title && <FieldError>{errors.title}</FieldError>}
        </Field>

        <FieldGroup className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="certification-price">Price</FieldLabel>

            <Input
              id="certification-price"
              type="number"
              min="0"
              step="0.01"
              value={value.price ?? ""}
              onChange={(event) => updateField("price", event.target.value)}
              placeholder="599.00"
              aria-invalid={Boolean(errors.price)}
            />

            {errors.price && <FieldError>{errors.price}</FieldError>}
          </Field>

          <Field>
            <FieldLabel htmlFor="certification-industry">
              Industry
            </FieldLabel>

            <Select
              value={value.industry ?? ""}
              onValueChange={(selectedIndustry) =>
                updateField("industry", selectedIndustry)
              }
            >
              <SelectTrigger
                id="certification-industry"
                className="w-full"
                aria-invalid={Boolean(errors.industry)}
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

            {errors.industry && <FieldError>{errors.industry}</FieldError>}
          </Field>
        </FieldGroup>

        <Field>
          <FieldLabel htmlFor="certification-description">
            Description
          </FieldLabel>

          <Textarea
            id="certification-description"
            value={value.description ?? ""}
            onChange={(event) =>
              updateField("description", event.target.value)
            }
            placeholder="Write a short description about this certification review."
            className="min-h-28 resize-y"
            aria-invalid={Boolean(errors.description)}
          />

          <FieldDescription>
            Briefly explain what learners will study in this review.
          </FieldDescription>

          {errors.description && (
            <FieldError>{errors.description}</FieldError>
          )}
        </Field>

        <Field>
          <FieldLabel>Certification Cover Image</FieldLabel>

          <FileUploadComponent
            value={value.imageFile}
            onChange={(file) => updateField("imageFile", file)}
            error={errors.imageFile}
          />

          <FieldDescription>
            Upload an image that will appear on the certification card.
          </FieldDescription>

          {errors.imageFile && (
            <FieldError>{errors.imageFile}</FieldError>
          )}
        </Field>
      </FieldGroup>
    </FieldSet>
  )
}

export default CertificationDetails