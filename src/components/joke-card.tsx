// src/components/joke-card.tsx
import React from 'react';

interface JokeCardProps {
    joke: {
        id: string;
        value: string;
        icon_url: string;
    };
}

const JokeCard: React.FC<JokeCardProps> = ({ joke } ) => {
    return (
        <div className="joke-card">
            <img src={joke.icon_url} alt="Joke Icon" />
            <p>{joke.value}</p>
        </div>
    );
};

export default JokeCard;