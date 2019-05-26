const mysql = require('mysql2/promise');
const seedData = require('./seedData.json')
const seedTags = require('./seedTags.json')
var bcrypt = require('bcrypt');
const saltRounds = 10;

function randomPictures(id, limit, pictures) {
  for (i = 0; i <= limit; i++) {
    const picture = {
      id,
      rank: i,
      path: `/../../public/sample/image-${Math.floor(Math.random() * 238 + 1)}`
    }
    pictures.push(picture)
  }
}

async function main() {
  try {
    const con =  await mysql.createConnection({      
      host: 'localhost',
      user: 'root',
      password: 'root',
      database: 'matcha',
      multipleStatements: true
    });

    var salt = bcrypt.genSaltSync(saltRounds);
    var hash = bcrypt.hashSync("coucou36", salt);

    await con.query(
      'INSERT INTO users (username, firstname, lastname, email, password, token, gender, orientation, activated, lat, lon, bio) VALUES ?',
      [seedData.map(row => {
        return [
          row.username,
          row.firstname,
          row.lastname,
          row.email,
          hash,
          'TEST',
          row.gender === 'Male' ? 'homme' : 'femme',
          row.orientation === 'M' ? 'homme' : (row.orientation === 'F' ? 'femme' : 'both'),
          true,
          row.lat,
          row.lon,
          row.bio
        ]})]
      )
      console.log('Users created!')
      
      await con.query(
        'INSERT INTO tags (label) VALUES ?',
        [seedTags.map(tag => tag.tag).filter((v, i, a) => a.indexOf(v) === i).map(tag => [tag])]
      )
      console.log('Tags created!')

      let pictures = []

      seedData.forEach((user, index) => {
        for (i = 1; i <= (Math.floor(Math.random() * 5) + 1); i++) {    
          pictures.push({
            index: index + 1,
            rank: i,
            path: `public/sample/image-${Math.floor(Math.random() * 239 + 1)}`
          })
        }
      })

      await con.query(
        'INSERT INTO pictures(id_user, rank, path) VALUES ?',
        [pictures.map(pic => {
          return [
            pic.index,
            pic.rank,
            pic.path
          ]
        })]
      )
      console.log('Pictures created!')

      let likes = []

      seedData.forEach((user, index) => {
        for (i = 1; i < Math.floor(Math.random() * (35 - 10 + 1)) + 10; i++) {    
          likes.push({
            idLiking: index + 1,
            idLiked: Math.floor(Math.random() * (1000)) + 1
          })
        }
      })

      await con.query(
        'INSERT INTO likes(id_liking, id_liked) VALUES ? ON DUPLICATE KEY UPDATE id_liking = id_liking',
        [likes.map(like => {
          return [
            like.idLiking,
            like.idLiked
          ]
        })]
      )
      console.log('Likes created!')

      let tagsUser = []

      seedData.forEach((user, index) => {
        for (i = 1; i < Math.floor(Math.random() * (6 - 2 + 1)) + 2; i++) {
          tagsUser.push(index + 1)
        }
      })

      for (let entry of tagsUser) {
        await con.query(
          'INSERT INTO tag_user (tag_id, user_id) VALUES ((SELECT id FROM tags ORDER BY RAND() LIMIT 1), ?)\
            ON DUPLICATE KEY UPDATE tag_id = tag_id',
          [entry]
        )
      }
      console.log('User tags created')

      let views = []
      
      seedData.forEach((user, index) => {
        for (i = 1; i < Math.floor(Math.random() * (60 - 50 + 1)) + 50; i++) {    
          views.push({
            notifier: index + 1,
            notified: Math.floor(Math.random() * (1000)) + 1
          })
        }
      })

      await con.query(
        'INSERT INTO notifs(id_notifier, id_notified, type) VALUES ?',
        [views.map(view => {
          return [
            view.notifier,
            view.notified,
            'view'
          ]
        })]
      )
      console.log('Views created!')

      let scores = []
      
      for (i = 0; i < seedData.length; i++) {
        const results = await con.query(
          'SELECT COUNT(count) AS views\
          FROM (\
            SELECT count(id) AS count \
            FROM notifs WHERE id_notified = ?\
            AND type = "view" AND time_to_sec(timediff(NOW(), add_date)) < 60*60*24*30\
            GROUP BY id_notifier\
          ) AS table_count;\
          SELECT COUNT(id) AS likes\
            FROM likes\
            WHERE id_liked = ?\
            AND time_to_sec(timediff(NOW(), add_date)) < 60*60*24*30',
          [i + 1, i + 1, i + 1, i + 1]
        )
        scores.push(results[0][1][0].likes / results[0][0][0].views)
      }
      
      for (i = 0; i < seedData.length; i++) {
        await con.query('UPDATE users SET score = ? where id = ?', [scores[i], i + 1])
      }

      console.log('Everything went well!')
      process.exit(0)

    } catch (e) {
      console.error('Oops it failed!', e)
      process.exit(1)
    }
  }

  main()
