const APIKEY = 'O9oicikwMmE4VUzzvWeljzcL3yQRtddg'; // API key 


let clickCounter = 0; // This is used to keep a count of the button clicks - for a fun little trick.
let topics = ['Pterodactyl','Godzilla','Andrea the giant','Mr. T']; // Array to hold button topics. Updated each time the user searches.
let state = "still"; // A flag to be used to decided to auto play gifs.

// This function is called to create the initial button set and any time the topics array is updated by searching.
function createBtn() {
    $( "#btnInsert" ).empty(); // Removes any exsisting buttons.

    // This loops through the topics array and creates a button for each item in the array.
    for ( let i = 0; i < topics.length; i++ ) {
        // Creates the button with an onClick event that calls the btnClick function with the button name as the parameter.
        $( "#btnInsert" ).append( `<button class="topicBtn" onClick="btnClick('${topics[i]}')">${topics[i]}</button>` );
    }
}


function getGifs( topic ) {
    $( "#gifs" ).empty(); // Removes any exsisting gif divs

    // This is the jQuery ajax call
    $.ajax({
        url: `https://api.giphy.com/v1/gifs/search?q=${topic}&limit=10&sort=relevant&rating=pg13&api_key=${APIKEY}`,
        method: "GET"
    }).then(function( response ) {

        let results = response.data; // The api response.
        //sort the array by gif object "slug:"
        results.sort(function(a, b){
            return a.slug > b.slug;
          });

        // This loops through the results array, adding a new div set for each of the items in the array.
        for (let i = 0; i < results.length; i++) {
           
            $( "#gifs" ).append( `<div style="background: url(./assets/images/a_Button.png)" class="gifWrap ${i}">
                                      <img src="${(state == "still") ? results[i].images.original_still.url : results[i].images.original.url}" 
                                           id="${i}" onclick="play(${i})" 
                                           data-state="${state}" 
                                           data-still="${results[i].images.original_still.url}" 
                                           data-play="${results[i].images.original.url}">
                                      <div class="gifRating"><strong>Rating:</strong> ${results[i].rating}</div><br>
                                  </div>`);
                    if(i%2==0){
                    var myWrap=i
                    // $(".gifWrap."+myWrap).css("color", "red");
                    $(".gifWrap."+myWrap).css("width", "220");
                    $(".gifWrap."+myWrap).css("background-image", "url(./assets/images/b_Button.png)"); 
                    }
                    // else{
                    //     $(".gifWrap."+myWrap+1).css(style="background: url(./assets/images/b_Button.png)"); 
                    // }

        }
      

    });
}






// Click event to process the search process - create a button - query the api.
$( "#btnSearch" ).on( "click", function(event) {
    if ($("#search-topic").val().trim() != "" ) { ///// Will only perform the following if the search term is not empty.
        event.preventDefault(); 
        let topic = $( "#search-topic" ).val().trim(); 
        ( topics.indexOf( topic ) === -1 ) ? topics.push( topic ) : ""; // Adds the search word to the topics array if it is not already there.
        createBtn(); // Refreshes the button set.
        getGifs( topic ); // Queries the api for the search term.
        $("#search-topic").val( "" ); // Clears the search term.
    }
});



//It will toggle the data-state attribute between still and play.
function play(index) {

    let gif = $( `#${index}` );

    let state = gif.attr("data-state");

    if (state === "still") {
        gif.attr("src", gif.attr("data-play"));
        gif.attr("data-state", "play");
    } else {
        gif.attr("src", gif.attr("data-still"));
        gif.attr("data-state", "still");
    }
}

function btnClick( topic ) {
    getGifs( topic ); // Passes the button name to the getGifs function.
    clickCounter++; // Increments the click counter.

}

// Initial page load to create the button set.
$( document ).ready(function() {

    createBtn();
});