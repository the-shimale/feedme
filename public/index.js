'use strict';

const onLoad = () => {
  // register event listener for submit button
  let submitButton = document.getElementById("submitBtn");
  let lookupButton = document.getElementById("lookupBtn");
  submitButton.addEventListener("click", onRegister, false);
  lookupButton.addEventListener("click", onLookup, false);
};

// pull user reviews
const onLookup = event => {
  event.preventDefault();
  let $error = $("#errorMsg");
	let params = document.getElementById("inputUsername").value;
	$.ajax({
	      url: `/v1/user/${params}`,
	      method: "get",
	      success: data => {
	      	// console.log(data);
		      let $reviews = $("#reviews");
		      data.forEach(review => {
		        $reviews.append(`<tr>
		        	<th>${review[0]}</th>
		            <th>${review[1]}</th>
		        </tr>`);
		      });
	      },
	      error: err => {
	        let errorEl = document.getElementById("errorMsg");
	        errorEl.innerHTML = `Error: ${err.responseJSON.error}`;
	      }
	   });
};

// hit the Amazon Sagemaker endpoint with user inputs
const onRegister = event => {
  event.preventDefault();
  let $error = $("#errorMsg");
  let $recommend = $('#recommendMsg');
  let $reject = $('#rejectMsg');
  const data = {
  	restaurantName: document.getElementById("inputRestaurantName").value,
  	username: document.getElementById("inputUsername").value
  }

   $.ajax({
      url: `/endpoint`,
      // url: `someendpoint`,
      method: "post",
      data: data,
      success: data => {
      	// data received from server
      	if (data.predictions[0].predicted_label > 0) {
      		$recommend.html(`Yes! Our model recommends this restaurant.`);
      	} else {
      		$reject.html(`No! Our model does not recommend this restaurant.`);
      	}
      	console.log(data);
      },
      error: err => {
        let errorEl = document.getElementById("errorMsg");
        errorEl.innerHTML = `Error: ${err.responseJSON.error}`;
      }
   });
};