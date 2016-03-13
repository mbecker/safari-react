#React Redux Firebase Authentication App

##Designing the State Shape
http://redux.js.org/docs/basics/Reducers.html#designing-the-state-shape

user
```javascript
{
	api: {
		user: {
			isFetching: false,
			didInvalidate: false,
			lastUpdated: 1439478405547,
		}
	},
	user: {
		uid: '123',
		email: 'test@gmail.com'
	}
}
```

parks
```javascript
{
	api: {
		parks: {
			isFetching: false,
			didInvalidate: false,
			lastUpdated: 1439478405547,
		}
	},
	parks: {
		parks: [
			{
				id: 12,
				name: 'Addo Elephant Park'
			},
			{
				id: 132,
				name: 'Kruger National Park'
			}
		]
	}
}
```

##Actions

```javascript
{ type: 'AUTHENTICATE' }
{ type: 'AUTHENTICATE', status: 'error', error: 'MESSAGE' }
{ type: 'AUTHENTICATE', status: 'success', response: { authData } }
```