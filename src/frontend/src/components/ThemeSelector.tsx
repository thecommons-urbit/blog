import { useState } from "react"

type ThemeSelectorProps = {
  theme:  string
  themes: string[]
  setTheme: React.Dispatch<React.SetStateAction<string>>
  setRescry: React.Dispatch<any>
}

export default function ThemeSelector(props: ThemeSelectorProps) {
  const { theme, themes, setTheme, setRescry } = props
  const [isOpen, setIsOpen] = useState(false)
  const toggleDropdown = () => setIsOpen(!isOpen)

  return (
    <div className="relative">
      <button
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        onClick={toggleDropdown}
      >
        <code>{`%${theme}`}</code>
      </button>
      <ul className={`bg-white w-full absolute rounded ${isOpen && 'border shadow'}`}>
        {isOpen && (
          <>
            {  themes.map((theme, i) => { return (
              <div className="bg-white m-auto" key={i}>
                <button
                  key={i}
                  className="block text-blue rounded py-2 w-full m-auto"
                  onClick={() => {setTheme(theme); toggleDropdown(); setRescry(i)}}
                >
                  <code>%{theme}</code>
                </button>
              </div>
            )})}
          </>
        )}
      </ul>
    </div>
  )
}
