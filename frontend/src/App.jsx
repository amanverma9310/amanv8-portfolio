import { useEffect, useState } from "react";
import PortfolioPage from "./pages/PortfolioPage";
export default function App() {
  const [dark,setDark]=useState(true);
  useEffect(()=>{document.documentElement.classList.toggle("dark",dark);},[dark]);
  return <PortfolioPage dark={dark} setDark={setDark}/>;
}
