import React from "react";
import { ComponentPreview } from "@/components/ComponentPreview";
import {
  Input,
  Textarea,
  PasswordInput,
  SearchInput,
  OtpInput,
  Select,
  Combobox,
  Autocomplete,
} from "@/components/ui/inputs";
import { Checkbox, Switch, Slider, RadioGroup, RadioGroupItem } from "@/components/ui/controls";

export function InputsSection() {
  return (
    <section id="inputs" className="flex scroll-mt-24 flex-col gap-8">
      <div className="border-border/60 flex flex-col gap-2 border-b pb-4">
        <h2 className="text-3xl font-bold tracking-tight">Inputs</h2>
        <p className="text-muted-foreground">Form controls for data entry.</p>
      </div>

      <ComponentPreview name="Text Input" description="Standard single-line text field.">
        <div className="flex w-full max-w-sm flex-col gap-4">
          <Input placeholder="Email address" type="email" />
          <Input placeholder="Disabled state" disabled />
        </div>
      </ComponentPreview>

      <ComponentPreview name="Password Input" description="Input with toggleable visibility.">
        <div className="w-full max-w-sm">
          <PasswordInput placeholder="Enter your password" />
        </div>
      </ComponentPreview>

      <ComponentPreview name="Search Input" description="Input with a search icon.">
        <div className="w-full max-w-sm">
          <SearchInput placeholder="Search destinations..." />
        </div>
      </ComponentPreview>

      <ComponentPreview name="Textarea" description="Multi-line text input.">
        <div className="w-full max-w-sm">
          <Textarea placeholder="Write your trip notes here..." />
        </div>
      </ComponentPreview>

      <ComponentPreview name="OTP Input" description="One-time password entry.">
        <OtpInput length={6} />
      </ComponentPreview>

      <ComponentPreview name="Select" description="Native select dropdown.">
        <div className="w-full max-w-sm">
          <Select
            options={[
              { label: "Economy", value: "economy" },
              { label: "Business", value: "business" },
              { label: "First Class", value: "first" },
            ]}
            placeholder="Select flight class"
          />
        </div>
      </ComponentPreview>

      <ComponentPreview name="Combobox" description="Searchable popover select.">
        <div className="w-full max-w-sm">
          <Combobox
            options={[
              { label: "Paris, France", value: "cdg" },
              { label: "Tokyo, Japan", value: "hnd" },
              { label: "New York, USA", value: "jfk" },
            ]}
            placeholder="Search airport..."
          />
        </div>
      </ComponentPreview>

      <ComponentPreview name="Autocomplete" description="Input with suggested options.">
        <div className="w-full max-w-sm">
          <Autocomplete
            options={[
              { label: "Hilton", value: "hilton" },
              { label: "Marriott", value: "marriott" },
              { label: "Hyatt", value: "hyatt" },
            ]}
            placeholder="Type hotel brand..."
          />
        </div>
      </ComponentPreview>

      <ComponentPreview name="Controls" description="Toggles, switches, and selection controls.">
        <div className="flex w-full max-w-sm flex-col gap-6">
          <div className="flex items-center gap-3">
            <Checkbox id="terms" />
            <label htmlFor="terms" className="text-sm font-medium">
              Accept terms and conditions
            </label>
          </div>

          <div className="flex items-center gap-3">
            <Switch id="airplane-mode" />
            <label htmlFor="airplane-mode" className="text-sm font-medium">
              Airplane Mode
            </label>
          </div>

          <div className="flex flex-col gap-3">
            <label className="text-sm font-medium">Volume</label>
            <Slider defaultValue={[50]} max={100} step={1} />
          </div>

          <div className="flex flex-col gap-3">
            <label className="text-sm font-medium">Notification Level</label>
            <RadioGroup defaultValue="all">
              <div className="flex items-center gap-3">
                <RadioGroupItem value="all" id="r1" />
                <label htmlFor="r1" className="text-sm font-medium">
                  All new messages
                </label>
              </div>
              <div className="flex items-center gap-3">
                <RadioGroupItem value="mentions" id="r2" />
                <label htmlFor="r2" className="text-sm font-medium">
                  Direct mentions
                </label>
              </div>
              <div className="flex items-center gap-3">
                <RadioGroupItem value="none" id="r3" />
                <label htmlFor="r3" className="text-sm font-medium">
                  Nothing
                </label>
              </div>
            </RadioGroup>
          </div>
        </div>
      </ComponentPreview>
    </section>
  );
}
