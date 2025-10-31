import express from 'express'
import cors from 'cors'

const app = express()
app.use(cors())
app.use(express.json())

app.use(express.static('public'));

app.use('/api/auth', require('./routes/auth').default)
app.use('/api/listings', require('./routes/listings').default)
app.use('/api/categories', require('./routes/categories').default)
app.use('/api/users', require('./routes/users').default)

app.use('/api/dashboard', require('./routes/dashboard').default)


app.use((err:any, req:any, res:any, next:any) => {
console.error(err)
res.status(err.status || 500).json({ message: err.message || 'Internal' })
})


const port = process.env.PORT || 4000
app.listen(port, () => console.log('Server listening on', port))

export default app