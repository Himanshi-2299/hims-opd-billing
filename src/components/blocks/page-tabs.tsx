import { Tabs, TabsList, TabsTrigger } from "../ui/tabs"

interface PageTabsProps {
  tabs: Array<{
    value: string
    label: string
  }>
  defaultValue?: string
  value?: string
  onValueChange?: (value: string) => void
}

export function PageTabs({ tabs, defaultValue, value, onValueChange }: PageTabsProps) {
  return (
    <div className="border-b px-6">
      <Tabs value={value} defaultValue={defaultValue} onValueChange={onValueChange}>
        <TabsList variant="line" className="h-9">
          {tabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value} className="px-4">
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  )
}
