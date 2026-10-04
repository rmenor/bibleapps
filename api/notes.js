const { neon } = require('@neondatabase/serverless');

const connectionString = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_vol2WQZFMN1k@ep-hidden-pond-b1qg6iyq.c-5.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

const sql = neon(connectionString);

module.exports = async function handler(req, res) {
  // Configuración de cabeceras CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // GET: Listar notas, buscar o filtrar por ID/etiqueta
    if (req.method === 'GET') {
      const { q, tag, id, status } = req.query || {};

      // Endpoint de salud y diagnóstico Neon
      if (status === 'health') {
        const check = await sql`SELECT NOW() as now, version() as version, current_database() as db;`;
        const count = await sql`SELECT count(*)::int as count FROM notes;`;
        return res.status(200).json({
          status: 'connected',
          database: check[0].db,
          timestamp: check[0].now,
          totalNotes: count[0].count,
          version: check[0].version
        });
      }

      if (id) {
        const rows = await sql`SELECT * FROM notes WHERE id = ${id};`;
        if (!rows.length) return res.status(404).json({ error: 'Nota no encontrada' });
        return res.status(200).json(rows[0]);
      }

      if (q) {
        const pattern = `%${q.toLowerCase()}%`;
        const rows = await sql`
          SELECT * FROM notes 
          WHERE LOWER(title) LIKE ${pattern} 
             OR LOWER(content) LIKE ${pattern} 
             OR LOWER(reference) LIKE ${pattern}
          ORDER BY pinned DESC, updated_at DESC;
        `;
        return res.status(200).json({ notes: rows, total: rows.length });
      }

      if (tag) {
        const rows = await sql`
          SELECT * FROM notes 
          WHERE ${tag} = ANY(tags)
          ORDER BY pinned DESC, updated_at DESC;
        `;
        return res.status(200).json({ notes: rows, total: rows.length });
      }

      const rows = await sql`SELECT * FROM notes ORDER BY pinned DESC, updated_at DESC;`;
      return res.status(200).json({ notes: rows, total: rows.length });
    }

    // POST: Crear una nueva nota
    if (req.method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
      const { title, content, reference = '', tags = [], color = 'default', pinned = false } = body;

      if (!title && !content) {
        return res.status(400).json({ error: 'El título o el contenido de la nota es obligatorio.' });
      }

      const safeTags = Array.isArray(tags) ? tags : [];
      const rows = await sql`
        INSERT INTO notes (title, content, reference, tags, color, pinned, updated_at)
        VALUES (${title || 'Nota sin título'}, ${content || ''}, ${reference || ''}, ${safeTags}, ${color || 'default'}, ${Boolean(pinned)}, NOW())
        RETURNING *;
      `;
      return res.status(201).json(rows[0]);
    }

    // PUT: Actualizar una nota existente
    if (req.method === 'PUT') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
      const { id, title, content, reference, tags, color, pinned } = body;

      if (!id) return res.status(400).json({ error: 'ID de la nota no proporcionado.' });

      const safeTags = Array.isArray(tags) ? tags : [];
      const rows = await sql`
        UPDATE notes
        SET 
          title = COALESCE(${title}, title),
          content = COALESCE(${content}, content),
          reference = COALESCE(${reference}, reference),
          tags = COALESCE(${safeTags}, tags),
          color = COALESCE(${color}, color),
          pinned = COALESCE(${pinned}, pinned),
          updated_at = NOW()
        WHERE id = ${id}
        RETURNING *;
      `;

      if (!rows.length) return res.status(404).json({ error: 'Nota no encontrada para actualizar.' });
      return res.status(200).json(rows[0]);
    }

    // DELETE: Eliminar una nota
    if (req.method === 'DELETE') {
      const id = req.query.id || (req.body && req.body.id);
      if (!id) return res.status(400).json({ error: 'ID de la nota no proporcionado.' });

      const rows = await sql`DELETE FROM notes WHERE id = ${id} RETURNING id;`;
      if (!rows.length) return res.status(404).json({ error: 'Nota no encontrada para eliminar.' });
      return res.status(200).json({ success: true, deletedId: rows[0].id });
    }

    return res.status(405).json({ error: 'Método HTTP no permitido.' });
  } catch (err) {
    console.error('Error en API Neon Notes:', err);
    return res.status(500).json({ error: 'Error al conectar con Neon Postgres', message: err.message });
  }
};
