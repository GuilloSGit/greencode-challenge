"use client"

import { useState, useEffect } from "react"
import JokeCard from "./joke-card"

export default function JokeApp() {

    interface joke {
        categories: string[]
        created_at: string
        icon_url: string
        id: string
        updated_at: string
        url: string
        value: string
    }

    const [joke, setJoke] = useState({})

    /* useState */
    const [tab, setTab] = useState(0)

    const fetchRandomJoke = async () => {
        try {
            const response = await fetch("https://api.chucknorris.io/jokes/random")
            const data = await response.json()
            setJoke(data)
        } catch (error) {
            console.error("Error fetching joke:", error)
        }
    }

    /* useEffect fetchRandomJoke */
    useEffect(() => {
        fetchRandomJoke()
    }, [])

    /* handleTabChange */
    const handleTabChange = (index: number) => {
        fetchRandomJoke()
        setJoke({})
        setTab(index)
    }

    /* render */
    return (
        <div className="w-full" data-theme="inline">
            <div role="tablist" className="tabs tabs-lift">
                <a role="tab" className="tab" onClick={() => handleTabChange(0)}>Tab 1</a>
                <a role="tab" className="tab" onClick={() => handleTabChange(1)}>Tab 2</a>
            </div>
            <div role="tabpanel" className="tab-content">
                <div className="tab-pane" hidden={tab == 0}>
                    <JokeCard joke={joke} />
                </div>
                <div className="tab-pane" hidden={tab !== 1}>
                    <p>Tab 2 content</p>
                </div>
            </div>
        </div>
    )
}
