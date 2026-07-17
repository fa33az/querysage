import { defineEventHandler, readBody, createError } from 'h3'
import pg from 'pg'
import mysql from 'mysql2/promise'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { engine, host, port, user, password, database, connectionString, query } = body

  const trimmedQuery = (query || '').trim()
  if (!trimmedQuery) {
    throw createError({ statusCode: 400, statusMessage: 'SQL Query must not be empty.' })
  }

  // Reject multiple statements separated by semicolons to prevent SQL injection / multi-execution
  const queryParts = trimmedQuery.split(';').map(p => p.trim()).filter(p => p.length > 0)
  if (queryParts.length > 1) {
    throw createError({ statusCode: 400, statusMessage: 'Multiple SQL statements are not allowed. Please enter only a single query.' })
  }
  const cleanQuery = queryParts[0]

  try {
    if (engine === 'postgresql') {
      const clientConfig = connectionString 
        ? { connectionString } 
        : { 
            host: host || 'localhost', 
            port: parseInt(port) || 5432, 
            user: user || 'postgres', 
            password: password || '', 
            database: database || 'postgres' 
          }
      
      const client = new pg.Client(clientConfig)
      await client.connect()
      
      // Execute explain query safely
      const res = await client.query(`EXPLAIN ANALYZE ${cleanQuery}`)
      await client.end()
      
      const planLines = res.rows.map((row: any) => row['QUERY PLAN']).join('\n')
      return { success: true, plan: planLines }

    } else if (engine === 'mysql') {
      const connection = await mysql.createConnection({
        host: host || 'localhost',
        port: parseInt(port) || 3306,
        user: user || 'root',
        password: password || '',
        database: database || ''
      })

      const [rows]: any = await connection.execute(`EXPLAIN ${cleanQuery}`)
      await connection.end()

      // Convert tabular mysql explain results into formatted string
      let formattedPlan = 'MySQL EXPLAIN tabular output:\n\n'
      if (Array.isArray(rows)) {
        formattedPlan += `+----+-------------+-------------+------------+------+-------------------+---------+---------+-------+------+----------+------------------------------------+\n`
        formattedPlan += `| id | select_type | table       | partitions | type | possible_keys     | key     | key_len | ref   | rows | filtered | Extra                              |\n`
        formattedPlan += `+----+-------------+-------------+------------+------+-------------------+---------+---------+-------+------+----------+------------------------------------+\n`
        rows.forEach((r: any) => {
          formattedPlan += `|  ${r.id || ''} | ${r.select_type || ''} | ${r.table || ''} | ${r.partitions || 'NULL'} | ${r.type || ''} | ${r.possible_keys || 'NULL'} | ${r.key || 'NULL'} | ${r.key_len || 'NULL'} | ${r.ref || 'NULL'} | ${r.rows || '0'} | ${r.filtered || '0.0'} | ${r.Extra || ''} |\n`
        })
        formattedPlan += `+----+-------------+-------------+------------+------+-------------------+---------+---------+-------+------+----------+------------------------------------+\n`
      } else {
        formattedPlan += JSON.stringify(rows, null, 2)
      }

      return { success: true, plan: formattedPlan }
    } else {
      return { success: false, message: `Direct explain is currently only supported for PostgreSQL and MySQL in Phase 3.` }
    }
  } catch (err: any) {
    return { success: false, message: `Connection failed: ${err.message}` }
  }
})
