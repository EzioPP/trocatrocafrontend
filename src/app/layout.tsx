import './globals.css'
export const metadata = {
  title: 'Troca Troca',
  description: 'Troca Troca Transações',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
