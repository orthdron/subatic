"use client";
import { useState } from "react";
import { Input } from "./ui/input";

export default function SearchBox() {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = (event: { preventDefault: () => void; }) => {
        event.preventDefault();
        if (searchTerm) {
            window.location.href = `/search/${encodeURIComponent(searchTerm)}`;
        }
    };
    return (
        <form onSubmit={handleSearch}>
            <Input className="text-blue-700 w-10/12" placeholder="Search Videos...." value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)} />
        </form>
    )
}