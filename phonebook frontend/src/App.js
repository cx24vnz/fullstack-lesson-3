import logo from './logo.svg';


import { useState, useEffect } from 'react'
import axios from 'axios'
import noteService from './services/backend'
import './index.css'

function GetAllData(setPersons) {
  useEffect(() => {

    noteService
      .getAll()
      .then((data) => {
        setPersons(data)

      })


  }, [])

}
function AddData(obj, setPersons, persons, setMessage, setNotificationType) {


  noteService.create(obj).then((data) => {

    let newList = persons.concat(data)
    setPersons(newList)

    setMessage(`Added '${data.name}'`)
    setNotificationType("success")
    setTimeout(() => {
      setMessage(null)
    }, 5000)
  }).catch((error) => {
    console.log(error.response.data.error)
    setMessage(`Action failed with the following error: '${error.response.data.error}'`)
    setNotificationType("error")
    setTimeout(() => {
      setMessage(null)
    }, 5000)
  })


}
function DeletePersonData(id, setPersons, persons, setMessage, setNotificationType, name) {

  let personDeleted = persons.find((element) => {
    return element.id == id
  })
  let nameDeletedPerson = personDeleted.name

  noteService.deletePerson(id).then((data) => {

    // when 204, data is emptly

    let newList = persons.filter((persons) => {
      return persons.id != personDeleted.id
    })
    setPersons(newList)


    setMessage(`Deleted '${nameDeletedPerson}'`)
    setNotificationType("success")
    setTimeout(() => {
      setMessage(null)
    }, 5000)
  })
    .catch((error) => {
      setMessage("Failed to delete " + name + " because it has already been deleted")
      setNotificationType("error")
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    })



}
function UpdatePersonData(personObj, setPersons, persons, setMessage, setNotificationType, name) {

  noteService.update(personObj.id, personObj).then((data) => {

    let newList = structuredClone(persons)
    let id = personObj.id

    newList = newList.map((element) => {
      let elementId = element.id

      if (id == elementId) {
        return data
      }
      return element

    })



    setPersons(newList)

    setMessage(`updated '${data.name}'`)
    setNotificationType("success")
    setTimeout(() => {
      setMessage(null)
    }, 5000)
  }).catch((error) => {

    console.log(error.response.data.error)
    setMessage("Failed to update " + name + " because" + error.response.data.error)
    setNotificationType("error")
    setTimeout(() => {
      setMessage(null)
    }, 5000)
  })



}

const Notification = ({ message, notificationType }) => {
  if (message === null) {
    return null
  }



  return (
    <div className={notificationType}>
      {message}
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('hello')
  const [newNumber, setNewNumber] = useState('322')
  const [filterName, setfilterName] = useState('')
  const [message, setMessage] = useState(null)
  const [notificationType, setNotificationType] = useState('some error happened...')

  let notificationProps = { setMessage, setNotificationType }



  GetAllData(setPersons)



  let formHandler = (e) => {

    e.preventDefault()

    let obj = {}
    persons.forEach((person) => {
      obj[person.name] = person
    })
    let existingPerson = obj[newName]
    if (existingPerson && newNumber == existingPerson?.number) {
      alert(`${newName} is already added to phonebook with the same number`)
      return
    }
    if (existingPerson) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        let person = { name: newName, number: newNumber, id: existingPerson.id + "" }

        return UpdatePersonData(person,
          setPersons, persons, setMessage, setNotificationType, person.name)
      }
      return
    }


    let idList = persons.map((person) => {
      return person.id
    })
    let maxId = Math.max(...idList)

    let newPersonObj = { name: newName, number: newNumber, id: (maxId + 1) + "" }


    AddData(newPersonObj, setPersons, persons, setMessage, setNotificationType)


  }
  let nameInputHandler = (e) => {

    setNewName(e.target.value)

  }
  let numberInputHandler = (e) => {

    setNewNumber(e.target.value)

  }

  let filterInputHandler = (e) => {

    setfilterName(e.target.value)

  }
  let deleteButtonHandler = (id, setPersons, persons, name, setMessage, setNotificationType) => {


    if (window.confirm("Delete " + name + " ?")) {
      DeletePersonData(id, setPersons, persons, setMessage, setNotificationType, name)
    }





  }


  let filterProps = { filterInputHandler, filterName }

  let addPersonsProps = { formHandler, newName, nameInputHandler, newNumber, numberInputHandler, deleteButtonHandler, ...notificationProps }

  return (
    <div>
      <Notification message={message} notificationType={notificationType} />
      <Filter {...filterProps} />
      <AddPersons {...addPersonsProps} />
      <DisplayNumbers persons={persons} filterName={filterName} deleteButtonHandler={deleteButtonHandler} setPersons={setPersons} {...notificationProps} />


    </div>
  )
}
function Filter({ filterName, filterInputHandler }) {
  return (
    <>
      <h2>Phonebook</h2>
      filter by name that includes: <input value={filterName} onChange={filterInputHandler} />
    </>
  )

}

function AddPersons({ formHandler, newName, nameInputHandler, newNumber, numberInputHandler }) {


  return (<>
    <h2>form</h2>
    <form onSubmit={formHandler}>

      <div>
        name: <input value={newName} onChange={nameInputHandler} />
      </div>

      <div >number:   <input value={newNumber} onChange={numberInputHandler} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  </>
  )
}
function DisplayNumbers(props) {
  let { persons, filterName, deleteButtonHandler, setPersons, setMessage, setNotificationType } = props

  let listPersonsSelected = persons.filter((person) => {
    let personText = person.name.toLowerCase()

    return personText.includes(filterName.toLowerCase())
  })


  return (
    <>

      <h2>Numbers</h2>
      {
        listPersonsSelected.map((person) => {
          return (
            <div key={"div" + person.name} style={{ display: 'flex', alignItems: 'center', gap: "10px" }}>
              <p key={person.name}> {person.name} {person.number} </p>
              <button key={"button" + person.name} onClick={() => {
                deleteButtonHandler(person.id, setPersons, persons, person.name, setMessage, setNotificationType)
              }} >
                delete
              </button>

            </div>)
        })
      }

    </>
  )
}

export default App;
