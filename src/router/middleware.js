
export default push => store => next => action => {
	// ToDo: If user loads page and user is authenticated (cookie, session) -> redirect to '/'
	if(action.meta && action.meta.authenticated) {
		console.log("Logged in .... redirect to '/")
		console.log(action);
		store.dispatch(push('/'));
	}

	// Logout middleware is not working:
	// The action "SET_INITIALSTATE" is called when the firebase.on listener gets fired for not authenticated;
	// thats even if you just open the page
	if(action.meta && !action.meta.authenticated) {
		console.log(action);
		console.log("Logged out .... redirect to '/")
		store.dispatch(push('/'));
	}
	return next(action);
}