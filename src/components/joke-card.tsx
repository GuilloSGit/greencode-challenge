import React from 'react';
import StarIcon from './SVG/StarIcon';
import TrashIcon from './SVG/TrashIcon';


interface JokeCardProps {
    joke: {
        id: string;
        value: string;
        icon_url: string;
        rating?: number;
    };
    onUpdateRating: (id: string, rating: number) => void;
    onDelete: (id: string) => void;
}

const JokeCard: React.FC<JokeCardProps> = ({ joke, onUpdateRating, onDelete }) => {
    return (
        <div className="bg-card text-card-foreground p-4 rounded-lg shadow-md border border-border">
            <div className="flex flex-col gap-3">
                <img src={joke.icon_url} alt="Joke Icon" className="w-12 h-12" />
                <p className="text-foreground text-white">{joke.value}</p>
                <div className="flex justify-between items-center mt-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button key={star} onClick={() => onUpdateRating(joke.id, star)} className="focus:outline-none">
                            <StarIcon filled={star <= (joke.rating || 0)} />
                        </button>
                    ))}
                </div>
                <button onClick={() => onDelete(joke.id)} className="focus:outline-none">
                    <TrashIcon filled={false} />
                </button>
            </div>
        </div>
    );
};

export default JokeCard;