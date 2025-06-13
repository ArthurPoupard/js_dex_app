import { useState, useEffect } from 'react'
import { getFullPokedexNumber, getPokedexNumber } from '../utils'
import TypeCard from './TypeCard'
import Modal from './Modal'

export default function PokeCard(props) {
    const { selectedPokemon } = props
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(false)
    const [skill, setSkill] = useState(null)
    const [loadingSkill, setLoadingSkill] = useState(false)

    // Added security with || {} if invalid data
    const { name, height, abilities, stats, types, moves, sprites } = data || {}
    
    const imgList = Object.keys(sprites || {}).filter(val => {
        // If no sprite, don't return
        if (!sprites[val]) { return false }
        // If sprites has these keywords, don't return
        if (['versions', 'other'].includes(val)) { return false }
        return true
    })

    // Fetch the flavor text of a specific move
    async function fetchMoveData(move, moveUrl) {
        // Test if valid or already loading info, to not loop
        if (loadingSkill || !localStorage || !moveUrl) { return }
        // Check if info already in the cache
        let cache_moves = {}
        if (localStorage.getItem('pokemon-moves')) {
            cache_moves = JSON.parse(localStorage.getItem('pokemon-moves'))
        }
        if (move in cache_moves) {
            console.log("Retrieved move data from cache")
            setSkill(cache_moves[move])
            return
        }
        // Otherwise fetch from API
        try {
            setLoadingSkill(true)
            const result = await fetch(moveUrl)
            const moveData = await result.json()
            // We search the flavour text for FRLG specifically
            const description = moveData?.flavor_text_entries.filter
            (val => {
                return val.version_group.name == 'firered-leafgreen'
            })[0]?.flavor_text
            const skillData = {
                name: move,
                description
            }
            setSkill(skillData)
            console.log("Fetched the data of a new move")
            // If fetched, save in cache_moves
            cache_moves[move] = skillData
            localStorage.setItem('pokemon-moves', JSON.stringify(cache_moves))
        }
        catch (err) {
            console.log(err.message)
        }
        finally {
            setLoadingSkill(false)
        }
    }

    useEffect(() => {
        // Test if already loading info, to not loop
        if (loading || !localStorage) { return }
        // Check if info already in the cache
        let cache = {}
        if (localStorage.getItem('pokedex')) {
            cache = JSON.parse(localStorage.getItem('pokedex'))
        }
        if (selectedPokemon in cache) {
            console.log("Retrieved pokemon data from cache")
            setData(cache[selectedPokemon])
            return
        }
        // Otherwise fetch from API
        async function fetchPokemonData() {
            setLoading(true)
            try {
                const baseUrl = "https://pokeapi.co/api/v2/"
                const suffix = "pokemon/" + getPokedexNumber(selectedPokemon)
                const finalUrl = baseUrl + suffix
                const result = await fetch(finalUrl)
                const pokemonData = await result.json()
                setData(pokemonData)
                console.log("Fetched the data of a new pokemon")
                // If fetched, save in cache
                cache[selectedPokemon] = pokemonData
                localStorage.setItem('pokedex', JSON.stringify(cache))
            }
            catch (err) {
                console.log(err.message)
            }
            finally {
                setLoading(false)
            }
        }
        fetchPokemonData()

    }, [selectedPokemon])

    if (loading || !data) {
        return (
            <div>
                <h2>Loading...</h2>
            </div>
        )
    }

    return (
        <div className='poke-card'>
            {/* If skill is true, render the rest, if not, hides */}
            {skill && (<Modal handleCloseModal={() => { setSkill(null) }}>
                <div>
                    <h6>Name</h6>
                    <h2 className='skill-name'>{skill.name.replaceAll('-', ' ')}</h2>
                </div>
                <div>
                    <h6>Name</h6>
                    <p>{skill.description}</p>
                </div>
            </Modal>)}


            <div>
                <h4>#{getFullPokedexNumber(selectedPokemon)}</h4>
                <h2>{name}</h2>
            </div>
            <div className='type-container'>
                {types.map((typeObj, typeIndex) => {
                    return (
                        <TypeCard key={typeIndex} type={typeObj?.type?.name} />
                    )
                })}
            </div>
            
            <img className='default-img' src={'/pokemon/' // Again, public is default directory, no need to search it specifically
                + getFullPokedexNumber(selectedPokemon) + '.png'} alt={`${name}_large_img`}/>
            
            <div className='img-container'>
                {imgList.map((spriteUrl, spriteIndex) => {
                    const imgUrl = sprites[spriteUrl]
                    return (
                        <img key={spriteIndex} src={imgUrl} alt={`${name}-img-${spriteUrl}`} />
                    )
                })}
            </div>
            <h3>Stats</h3>
            <div className='stat-card'>
                {stats.map((statObj, statIndex) => {
                    const {stat, base_stat} = statObj
                    return (
                        <div key={statIndex} className='stat-item'>
                            <p>{stat?.name.replaceAll('-', ' ')}</p>
                            <h4>{base_stat}</h4>
                        </div>
                    )
                })}
            </div>

            <h3>Moves</h3>
            <div className='pokemon-move-grid'>
                {moves.map((moveObj, moveIndex) => {
                    return (
                        <button className='button-card pokemon-move'
                        key={moveIndex} onClick = {() => {
                                fetchMoveData(moveObj?.move?.name, moveObj?.move?.url)
                             }}>
                            <p>{moveObj?.move?.name.replaceAll('-', ' ')}</p>
                        </button>
                    )
                })}

            </div>

        </div>
    )
}