export const SearchBox = ({searchTerm, setSearchTerm, searchMovies, SearchIcon, handleSearch}) => {
    function handleKeyPress(e) {
        if (e.key === 'Enter') {
            handleSearch(searchTerm);
        }
    }

    return (
        <div className="search">
            <input
                placeholder="Search for movies"
                value={searchTerm}
                onChange={(e) => {
                    const newSearchTerm = e.target.value;
                    setSearchTerm(newSearchTerm);
                    handleSearch(newSearchTerm);
                }}
                onKeyPress={handleKeyPress}
            />
            <img
                src={SearchIcon}
                alt="search"
                onClick={() => handleSearch(searchTerm)}
            />
        </div>
    )
}




