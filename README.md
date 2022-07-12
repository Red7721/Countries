# Countries
Single page application for data table rendering with sort, orderBy, pagination and search conditions.

## Stack
MERN

## Installation

    1. Install node-modules
        . run the cmd 'npm i' in main project folder and client folder

    2. Run the project(both server and client application concurrently)
        . run the cmd 'npm run dev' in the main project folder



## Usage

    1. Use the paginator to render different results of the table.

    2. Sorting by Column can be done by clicking on the Column's header with the arrow's direction indicating ascending or descending order.

    3. Search takes the following conditional format: <columnName.operatorType:value>
        .The column names should be specified in camel case. 
            Id => id, Country Name => countryName 
        .There are 4 operator types => [lt(lessthan), gt(greaterThan), eq(equalTo), regex(regularExpression)]
         
    4. Search conditions examples<columnName.operatorType:value>: 
        <countryName.eq:India>
        <population.gt:40>
        <timeZone.regex:.*+04.00.*>
        <capitalCity:Baku>
        <capitalCity:New Delhi>

    6. Multiple search condition can be applied by comma seperation. For example:
        <countryName.regex:.*di.*,capitalCity.regex:New.*>
        <countryName.regex:.*di.*,population.gt:30>
    
    5. There should be no spaces in search conditions except for values.

    6. There should be no space between comma seperated conditions.
