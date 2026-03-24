export function GlobalFooter() {
  return (
    <footer className="border-t px-6 py-2">
      <div className="container mx-auto text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} IQLine Inc. All rights reserved.</p>
      </div>
    </footer>
  )
}
