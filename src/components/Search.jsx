

const Search = () => {
  return (
    <div className="search">
        <div>
        

        <input
        type="text"
        placeholder="Search through thousands of movies"
            
        onChange={(e)=>setSearchTerms(e.target.value)}   
        />


        </div>
    </div>
  )
}

export default Search
