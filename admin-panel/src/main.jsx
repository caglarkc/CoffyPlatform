import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider, CssBaseline } from '@mui/material'
import theme from './theme'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  // StrictMode geliştirme ortamındayken bileşenlerin ve etkilerin iki kez render edilmesine neden olur
  // Bu, etkilerin temizleme işlevlerini test etmek için faydalıdır
  // Ancak bu davranış, konsolda her şeyin iki kez yazdırılmasına neden olur
  // Gereksiz logları önlemek için StrictMode'u kaldırabilir veya yoruma alabilirsiniz
  // <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  // </StrictMode>
);
