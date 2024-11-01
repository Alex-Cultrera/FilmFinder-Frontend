import SearchIcon from "./search.svg";


export const SearchBox = ({searchTerm, setSearchTerm, searchMovies, SearchIcon, handleSearch}) => {
function handleKeyPress(e) {
    if (e.key === 'Enter') {
        searchMovies(searchTerm)
    }
}
    return (
        <div className="search">
            <input
                placeholder="Search for movies"
                value={searchTerm}
                onChange={(e) => {
                    setSearchTerm(e.target.value)
                    handleSearch(searchTerm)
                }}
                onKeyPress={handleKeyPress}
            /><img src={SearchIcon}
                   alt="search"
                   onClick={() => searchMovies(searchTerm)}
        />
        </div>
    )
}

