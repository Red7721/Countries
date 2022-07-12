import React, { useState, useEffect, useMemo } from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Ripple } from 'primereact/ripple'
import { Dropdown } from 'primereact/dropdown'
import { InputText } from 'primereact/inputtext'
import { classNames } from 'primereact/utils'
import './style.css'
import './App.scss'
import axios from 'axios'

function App() {
  const [countries, setCountries] = useState([])
  const [filteredData, setFilteredData] = useState([])

  const [searchCondition, setSearchCondition] = useState()

  const columns = [
    { field: 'id', header: 'Id' },
    { field: 'countryName', header: 'Country Name' },
    { field: 'capitalCity', header: 'Capital City' },
    { field: 'population', header: 'Population' },
    { field: 'timeZone', header: 'Time Zone' },
  ]

  const dynamicColumns = columns.map((col, i) => {
    return (
      <Column key={col.field} field={col.field} header={col.header} sortable />
    )
  })

  useEffect(() => {
    async function init() {
      const response = await axios
        .get('http://localhost:3001/countries')
        .then((res) => {
          return res.data
        })
        .catch((err) => {
          console.log(err)
        })
      const data = response.result
      setCountries(data)
      setFilteredData(data)
    }
    init()
  }, [])

  const customTemplate = {
    layout:
      'FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown',
    FirstPageLink: (options) => {
      return (
        <button
          type="button"
          className={options.className}
          onClick={options.onClick}
          disabled={options.disabled}
        >
          <span className="p-3">
            <i className=" pi pi-angle-double-left"></i>First
          </span>
          <Ripple />
        </button>
      )
    },
    LastPageLink: (options) => {
      return (
        <button
          type="button"
          className={options.className}
          onClick={options.onClick}
          disabled={options.disabled}
        >
          <span className="p-3">
            Last<i className=" pi pi-angle-double-right"></i>
          </span>
          <Ripple />
        </button>
      )
    },
    PrevPageLink: (options) => {
      return (
        <button
          type="button"
          className={options.className}
          onClick={options.onClick}
          disabled={options.disabled}
        >
          <span className="p-3">
            <i className=" pi pi-angle-left"></i>Previous
          </span>
          <Ripple />
        </button>
      )
    },
    NextPageLink: (options) => {
      return (
        <button
          type="button"
          className={options.className}
          onClick={options.onClick}
          disabled={options.disabled}
        >
          <span className="p-3">
            Next<i className=" pi pi-angle-right"></i>
          </span>
          <Ripple />
        </button>
      )
    },
    PageLinks: (options) => {
      if (
        (options.view.startPage === options.page &&
          options.view.startPage !== 0) ||
        (options.view.endPage === options.page &&
          options.page + 1 !== options.totalPages)
      ) {
        const className = classNames(options.className, { 'p-disabled': true })

        return (
          <span className={className} style={{ userSelect: 'none' }}>
            ...
          </span>
        )
      }

      return (
        <button
          type="button"
          className={options.className}
          onClick={options.onClick}
        >
          {options.page + 1}
          <Ripple />
        </button>
      )
    },
    RowsPerPageDropdown: (options) => {
      const dropdownOptions = [
        { label: 10, value: 10 },
        { label: 20, value: 20 },
        { label: 50, value: 50 },
        { label: 'All', value: options.totalRecords },
      ]

      return (
        <span>
          <span className="p-3">Show</span>
          <Dropdown
            value={options.value}
            options={dropdownOptions}
            onChange={options.onChange}
          />
          <span className="p-3">Rows
          </span>
        </span>
      )
    },
  }

  const filterDataTable = (condition) => {
    let conditions = condition.split(',')
    let conditionsArray = []

    conditions.forEach((condition) => {
      if (condition != '' && condition.includes('.')) {
        conditionsArray.push({
          field: condition.split('.')[0],
          operator: condition.split('.')[1].split(':')[0],
          value: condition.split(':')[1],
        })
      } else if (condition != '' && !condition.includes('.')) {
        conditionsArray.push({
          field: condition.split(':')[0],
          operator: 'eq',
          value: condition.split(':')[1],
        })
      }
    })

    let finalData = []
    countries.forEach((country) => {
      let matchCount = []
      conditionsArray.forEach((condition) => {
        switch (condition.operator) {
          case 'lt': {
            matchCount.push(country[condition.field] < condition.value)
            break
          }
          case 'gt': {
            matchCount.push(country[condition.field] > condition.value)
            break
          }
          case 'eq': {
            matchCount.push(country[condition.field] == condition.value)
            break
          }
          case 'regex': {
            let regex = new RegExp(String(condition.value))
            matchCount.push(regex.test(country[condition.field]))
            break
          }
        }
      })

      let matchedConditions = matchCount.every((value) => value == true)

      if (matchedConditions) {
        {
          finalData.push(country)
        }
      }
    })

    setFilteredData(finalData)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    let searchCondition = event.target.children[1].value
    setSearchCondition(searchCondition)
    filterDataTable(searchCondition)
  }

  const renderHeader = () => {
    return (
      <span className="filter customSearch p-input-icon-right">
        
          <form onSubmit={(event) => handleSubmit(event)} autoComplete="off">
     
              <button type="submit"></button>
       
            <InputText placeholder="Search" type="text" />
          </form>
      </span>
    )
  }

  const header = renderHeader()

  return (
    <div className="container">
      <div className="content">
        <div className="mainContent page">
          <div className="datatable">
            <div className="card">
              <DataTable
                value={filteredData}
                paginator
                paginatorTemplate={customTemplate}
                rows={10}
                rowsPerPageOptions={[5, 10, 20]}
                paginatorClassName=""
                responsiveLayout="scroll"
                removableSort
                header={header}
              >
                {dynamicColumns}
              </DataTable>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
