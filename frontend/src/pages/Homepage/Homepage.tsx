import Axios from "axios";
import { useCallback, useEffect, useState } from "react";

import { API } from '../../utils';
import { useSearch } from "../../hooks";
import { H2, Loader, UniversitiesContainer, Container, TextField, Button } from "../../components";

import "./Homepage.css";


export interface IUniversity {
    name: string;
    country: string;
    alpha_two_code: string;
    "state-province": string | null;

    domains: string[];
    web_pages: string[];
}

export function Homepage() {
    const { searched, toSearch, fireSearch, setSearched, setFireSearch } = useSearch();

    const [name, setName] = useState(toSearch.name);
    const [country, setCountry] = useState(toSearch.country);
    const [lastName, setLastName] = useState(toSearch.name);
    const [lastCountry, setLastCountry] = useState(toSearch.country);

    const [isStart, setIsStart] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    const [universities, setUniversities] = useState<IUniversity[]>([]);

    const loadUniversities = useCallback((country : string, name : string) => {
        Axios.get(API, {
            params: { country, name }
        }).then(response => {
            setUniversities(response.data);

            setIsStart(false);
            setIsLoading(false);
        });
    }, []);

    const onButtonSearchClick = useCallback((event?: React.SyntheticEvent) => {
        setIsLoading(true);

        setLastName(name);
        setLastCountry(country);

        const newSearched = [...searched, { country, name }];
        setSearched(newSearched);

        loadUniversities(country, name);
        
    }, [country, name, searched, setSearched, loadUniversities]);

    const onButtonResetClick = useCallback((event?: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        setName("");
        setCountry("");
        setLastName("");
        setLastCountry("");

        setIsStart(true);

        setUniversities([]);
    }, [])

    const onTextCountryChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => setCountry(event.currentTarget.value),
        []
    );

    const onTextNameChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => setName(event.currentTarget.value)
        , []
    );

    useEffect(() => {
        if (!fireSearch) return;

        onButtonSearchClick();

        setName("");
        setCountry("");
        setFireSearch(false);
    });

    return (
        <div className="page-container">
            <Container className="country-container">
                <H2>Write a country and/or a name and get universities</H2>
                <TextField onChange={onTextCountryChange} placeholder='eg. Italy' />
                <TextField onChange={onTextNameChange} placeholder='eg. sap of "Sapienza"' />
                <Button type="primary" onClick={onButtonSearchClick}>
                    Search
                </Button>
                <Button type="danger" onClick={onButtonResetClick}>
                    Reset
                </Button>
            </Container>
            {
                isLoading ?
                <Loader /> :
                <UniversitiesContainer
                    name={lastName}
                    country={lastCountry}
                    universities={universities}

                    isStart={isStart}
                />
            }
        </div>
    );
}