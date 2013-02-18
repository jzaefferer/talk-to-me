// TODO: handle form submit, show confirmation in place of the form
// use geolocation API to lookup address

var address = $( "#address" );
if ( localStorage.getItem( "address" ) ) {
	address.val( localStorage.getItem( "address" ) );
} else {
	address.focus( function() {
		var geocoder = new google.maps.Geocoder();
		navigator.geolocation.getCurrentPosition(function( position ) {
			var latlng = new google.maps.LatLng( position.coords.latitude, position.coords.longitude );
			geocoder.geocode({
				latLng: latlng
			}, function( results, status ) {
				if ( status !== "OK" ) {
					return;
				}
				var address_components = {};
				// search for postal_code
				$.each(results, function( index, result ) {
					$.each( result.address_components, function( index, component ) {
						if ( component.types.length === 1 && component.types[ 0 ] === "postal_code" ) {
							address_components.postal_code =  component.long_name;
						}
						if ( component.types.length > 0 && component.types[ 0 ] === "country" ) {
							address_components.country = component.long_name;
						}
					});
				});
				var result = address_components.postal_code + ", " + address_components.country;
				localStorage.setItem( "address", result );
				address.val( result );
			});
		}, function( error ) {
			console.error( error );
		});
	});
}

$( "main form" ).on( "submit", function( event ) {
	event.preventDefault();
	var email = $( "#email" );
	if ( !email.val() || !address.val() ) {
		alert( "Please fill out both fields" );
		return;
	}

	var form = $( this ).addClass( "submitted" );
	form.find( ".overlay" ).removeClass( "hidden" )
		.find( ".status" ).text( "Subscribing " + email.val() + "..." );
	setTimeout(function() {
		form.removeClass( "submitted" ).addClass( "confirmed" );
		form.find( ".confirmation").removeClass( "hidden" )
			.find( ".status" ).text( "We'll send you one email to " + email.val() + " to confirm your address. We hope you don't ever get any email from us afterwards." );
	}, 3500);
});
