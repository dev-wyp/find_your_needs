import express from 'express'
import cors from 'cors'

const app = express()
app.use(cors())
app.use(express.json())
app.set("json spaces", 2);

import authRoutes from './routes/auth'
import listingsRoutes from './routes/listings'
import categoriesRoutes from './routes/categories'
import usersRoutes from './routes/users'
import dashboardRoutes from './routes/dashboard'

app.use('/api/auth', authRoutes)
app.use('/api/listings', listingsRoutes)
app.use('/api/categories', categoriesRoutes)
app.use('/api/users', usersRoutes)
app.use('/api/dashboard', dashboardRoutes)


app.use((err:any, req:any, res:any, next:any) => {
console.error(err)
res.status(err.status || 500).json({ message: err.message || 'Internal' })
})

app.use(express.static('public'));

// const port = process.env.PORT || 4000
// app.listen(port, () => console.log('Server listening on', port))

export default app