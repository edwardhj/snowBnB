Here are the updates you will need to make / test


1. Already Updated (just test live)
- ERROR - Sign Up - Body Validation (ensure password msg doesn't pop up)

2. Get All Spots (& everywhere else Spots are returned)
- lat & lng & price are populating as strings; they should be integers

3. ERROR - Create a Booking - Invalid Spot Id (updated)
- I'm getting error message: cannot read property of userId of null

4. ERROR - Edit a Booking - Invalid Booking Id (updated)
- I'm getting error message: cannot read property of userId of null

5. NOT AUTHED - Create a Booking Based on a Spot Id (updated)
- I'm having it go through when it should not go through if Spot doesn't belong to current user


check get all spots
check get /curent for spots
check get details for a spot from an id
check create a spot
check edit a spot