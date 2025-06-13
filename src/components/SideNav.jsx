// Specifying 'index.js' isn't necessary as it is the default file
import { first151Pokemon, getFullPokedexNumber } from "../utils"
import { useState } from 'react'

export default function SideNav(props) {
    const {selectedPokemon, setSelectedPokemon, handleToggleMenu, showSideMenu } = props
    const [ searchValue, setsearchValue ] = useState("")
    const filteredPokemon = first151Pokemon.filter((ele, eleIndex) => {
        // If dex n° includes current search
        if (getFullPokedexNumber(eleIndex).includes(searchValue)) { return true }
        // If dex name includes current search
        if (ele.toLowerCase().includes(searchValue.toLowerCase())) { return true }
        return false
    })
    return (
        <nav className={" " + (!showSideMenu ? " open" : "")}>
            <div className={"header " + (!showSideMenu ? " open" : "")}>
                <button onClick={handleToggleMenu} className='open-nav-button'>
                    <i className="fa-solid fa-arrow-left-long"></i>
                </button>
                <h1 className="text-gradient">Dex</h1>
            </div>
            {/* Inputs need a variable */}
            <input placeholder="001, Bulbasaur..." value={searchValue} onChange={(e) => {setsearchValue(e.target.value)}} />
            {
                filteredPokemon.map((pokemon, pokemonIndex) => {
                    return (
                        <button onClick={() => {
                            setSelectedPokemon(first151Pokemon.indexOf(pokemon))
                            handleToggleMenu()
                        }} key={pokemonIndex} className={"nav-card " +
                         (pokemonIndex === selectedPokemon ? ' nav-card-selected' : ' ')
                        }>
                            <p>{getFullPokedexNumber(first151Pokemon.indexOf(pokemon))}</p>
                            <p>{pokemon}</p>
                        </button>
                    )
                })
            }
        </nav>
    )
}