import React from 'react';
import ReactDOM from 'react-dom';
import create from 'zustand'
import { ApolloProvider, ApolloClient, InMemoryCache, useQuery, gql } from '@apollo/client';

import './app.css';

const useStore = create(set => ({
    filter: '',
    setFilter: (filter) => set(() => ({ filter }))
}));

const client = new ApolloClient({
    uri: 'https://api.spacex.land/graphql',
    cache: new InMemoryCache()
});

const GET_SHIPS = gql`
    query SHIPS {
        ships {
            id
            name
            type
        }
    }
`;

function Ships() {
    const filter = useStore(state => state.filter);
    const { loading, error, data } = useQuery(GET_SHIPS);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;

    return data.ships.filter(({ name }) => name.toLowerCase().includes(filter.toLowerCase())).map(({ id, name, type }) => (
        <div key={id}>
            <p>
                [{type}] {name}
            </p>
        </div>
    ));
}

function FilterInput() {
    const { filter, setFilter } = useStore(state => state);
    return (
        <input placeholder="Search by name" value={filter} onChange={evt => setFilter(evt.target.value)} />
    );
}

function App() {
    return (
        <ApolloProvider client={client}>
            <FilterInput />
            <h1>Ships [type] name</h1>
            <Ships />
        </ApolloProvider>
    );
}

ReactDOM.render(<App />, document.getElementById('app'));
