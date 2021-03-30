const express = require('express')
const app = express()

app.use(
    express.urlencoded({
        extended: true
    })
)

app.use(express.json())

const port = 3000

const uniqid = require('uniqid')

const car_fields = [ "plate", "model", "type" ]
const driver_fields = [ "firstName", "lastName", "carId" ]

const cars = [
    {
        "id": "c721f561-5ea9-4a12-9496-6e7e423bf4ae",
        "plate": "АА5638РЕ",
        "model": "VW Passat",
        "type": "MAZHOR"
    },
    {
        "id": "985abccc-9958-4949-943d-36de70335d43",
        "plate": "АА3975ТА",
        "model": "Daewoo Lanos",
        "type": "ZHLOB"
    }
]

const drivers = [
    {
        "id": "2b510511-48d9-4bcd-8ae1-b6e72a928090",
        "firstName": "Тайвин",
        "lastName": "Ланнистер",
        "carId": "c721f561-5ea9-4a12-9496-6e7e423bf4ae"
    },
    {
        "id": "a5e1f2b7-10d3-47cf-809a-b4501e6190b5",
        "firstName": "Джон",
        "lastName": "Сноу",
        "carId": "985abccc-9958-4949-943d-36de70335d43"
    },
    {
        "id": "e6caf4dc-e994-4c4e-8631-5c22272610e8",
        "firstName": "Бран",
        "lastName": "Старк",
        "carId": "985abccc-9958-4949-943d-36de70335d43"
    }
]

app.get('/car/:id', (req, res) => {
    const car = cars.filter(car => car.id == req.params.id)

    if(car.length > 0){
        res.status(200).json( 
            car[0]
        )
        return
    }

    res.status(404).json({
        'error': 'ID wasn\'t found.'
    })

})

app.get('/drivers', (req, res) => {

    if(req.query.carId === undefined){

        res.status(200).json( drivers )

        return

    }

    const driverCars = drivers.filter(driver => driver.carId == req.query.carId)

    res.status(200).json( 
        driverCars
    )

})

app.get('/driver/:id', (req, res) => {
    const driver = drivers.filter(driver => driver.id == req.params.id)

    if(driver.length > 0){
        res.status(200).json( 
            driver[0]
        )
        return
    }

    res.status(404).json({
        'error': 'ID wasn\'t found.'
    })

})

app.post( '/car', ( req, res )=>{

    const fields = car_fields.filter( field => {
        return req.body[field] !== '' && req.body[field] !== undefined
    } )

    if( fields.length < car_fields.length ) {
        const missed_fields = []
        
        car_fields.forEach(field => {
            if(req.body[field] === '' || req.body[field] === undefined) missed_fields.push( field )
        });
        
        let errorMessage = `All fields are mandatory, please add: ${ missed_fields.join(', ') }`

        res.status(400).json({
            'error': errorMessage
        })

        return
    }

    res.status(201).json(
        { 
            id: uniqid('hello-', '-car'),
            plate: req.body.plate,
            model: req.body.model,
            type: req.body.type
        }
    )

} )

app.post( '/driver', ( req, res )=>{

    const fields = driver_fields.filter( field => {
        return req.body[field] !== '' && req.body[field] !== undefined
    } )
    
    const errorMessage = []

    if( fields.length < driver_fields.length ) {
        const missed_fields = []
        
        driver_fields.forEach(field => {
            if(req.body[field] === '' || req.body[field] === undefined) missed_fields.push( field )
        });
        
        errorMessage.push( `All fields are mandatory, please add: ${ missed_fields.join(', ') }` )

    }

    if(req.body.carId !== undefined && req.body.carId !== ''){
        if(cars.filter( car => car.id == req.body.carId ).length == 0){
            errorMessage.push( `Car with such id ${ req.body.carId } was not found` )
        }
    }

    if(errorMessage.length > 0){
        res.status(400).json({
            'error': errorMessage
        })

        return
    }

    res.status(201).json(
        { 
            id: uniqid('hello-', '-driver'),
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            carId: req.body.carId
        }
    )

} )

app.put('/car/:id', ( req, res ) => {

    const car = cars.filter( car => car.id == req.params.id )

    if(car.length == 0){
        res.status(404).json( {error: "Car was not found."} )
        return
    }

    let newCar = car[0]

    car_fields.forEach( field => {
        if( req.body[field] ) newCar[field] = req.body[field]
    } )

    res.status(200).json(newCar)

})

app.put('/driver/:id', ( req, res ) => {

    const driver = drivers.filter( driver => driver.id == req.params.id )

    if(driver.length == 0){
        res.status(404).json( {error: "Driver was not found."} )
        return
    }

    if( req.body.carId ){

        const car = cars.filter( car => car.id == req.params.carId )

        if(car.length == 0){
            res.status(404).json( {error: `Car with such id ${req.params.carId} was not found.`} )
            return
        }
    }


    let newDriver = driver[0]

    driver_fields.forEach( field => {
        if( req.body[field] ) newDriver[field] = req.body[field]
    } )

    res.status(200).json(newDriver)

})

app.delete( '/car/:id', (req, res) => {
    const car = cars.filter( car => car.id == req.params.id )

    if(car.length == 0){
        res.status(404).json( {error: "Car was not found."})
        return
    }

    res.status(200).json( {error: `Car with id: ${req.params.id} was deleted.`})

} )

app.delete( '/driver/:id', (req, res) => {
    const driver = drivers.filter( driver => driver.id == req.params.id )

    if(driver.length == 0){
        res.status(404).json( {error: "Driver was not found."})
        return
    }

    res.status(200).json( {error: `Driver with id: ${req.params.id} was deleted.`})

} )

app.listen(port, () => {
    console.log(`RESTful API app listening at http://localhost:${port}`)
})