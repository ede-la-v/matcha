const express = require('express')
const con = require('./connection')

select * from users where gender in ("femme", "homme") and id < 10;

SELECT km.suggid, km.dist, mint.res/km.dist
from (select users.id as suggid, sqrt(pow(abs(users.lat - latc)*111,2) + pow(abs(users.lon - lonc)*111, 2)) as dist
from users right  
join (select id as client, lat as latc, lon as lonc from users where id = 11) as test 
	on 1 = 1 
where users.gender in ("femme", "homme") and users.id < 800 and users.id != 11) as km
INNER JOIN (
select min(dist) as res
from
(select users.id as suggid, sqrt(pow(abs(users.lat - latc)*111,2) + pow(abs(users.lon - lonc)*111, 2)) as dist
from users 
right join (select id as client, lat as latc, lon as lonc from users where id = 11) as test2 
	on 1 = 1 
where users.gender in ("femme", "homme") and users.id < 800 and users.id != 11) as diff2) as mint
	on 1 = 1;

select user_id from tag_user
inner join users
	on users.id = user_id
where users.gender in ("femme", "homme") and users.id < 10;

select client.user_id, client.tag_id, truc.user_id from tag_user as client
inner join tag_user as truc 
	on client.tag_id = truc.tag_id
where client.user_id = 1;

select tags.user_id, tags.count as countsugg, tot.count as counttot, client.count as countclient, tags.count / ((tot.count + client.count)/2)
from (select truc.user_id, count(client.tag_id) as count 
	from tag_user as client
inner join tag_user as truc 
	on client.tag_id = truc.tag_id
where client.user_id = 1
group by truc.user_id) as tags
INNER join (SELECT user_id, count(user_id) as count from tag_user group by user_id) as tot
	on tags.user_id = tot.user_id
INNER join (SELECT user_id, count(user_id) as count from tag_user group by user_id) as client
	on 1 = client.user_id


//pour tester avec user 11 et un user qui cherche homme ou femme
SELECT suggid, dist_rel, restag FROM (SELECT km.suggid, km.dist, mint.res/km.dist as dist_rel, concat, dist
from (select users.id as suggid, sqrt(pow(abs(users.lat - latc)*111,2) + pow(abs(users.lon - lonc)*111, 2)) as dist
from users right  
join (select id as client, lat as latc, lon as lonc from users where id = 11) as test 
	on 1 = 1 
where users.gender in ("femme", "homme") and users.id < 800 and users.id != 11) as km
INNER JOIN (select min(dist) as res
from
(select users.id as suggid, sqrt(pow(abs(users.lat - latc)*111,2) + pow(abs(users.lon - lonc)*111, 2)) as dist
from users 
right join (select id as client, lat as latc, lon as lonc from users where id = 11) as test2 
	on 1 = 1 
where users.gender in ("femme", "homme") and users.id < 800 and users.id != 11) as diff2) as mint
	on 1 = 1) as tab_dist
left join (select concat, tags.user_id, tags.count as countsugg, tot.count as counttot, client.count as countclient, tags.count / ((tot.count + client.count)/2) as restag
from (select truc.user_id, count(client.tag_id) as count, GROUP_CONCAT(convert(client.tag_id, char) SEPARATOR ' ') as concat
	from tag_user as client
inner join tag_user as truc 
	on client.tag_id = truc.tag_id
where client.user_id = 11
group by truc.user_id) as tags
INNER join (SELECT user_id, count(user_id) as count from tag_user group by user_id) as tot
	on tags.user_id = tot.user_id
INNER join (SELECT user_id, count(user_id) as count from tag_user group by user_id) as client
	on 1 = client.user_id) as tab_tag
on tab_dist.suggid = tab_tag.user_id;

//tableau a envoyer[user, gender1, gender2,user, user, gender1, gender2,user, user]
SELECT suggid, dist_rel, restag, pop FROM
(SELECT km.suggid, km.dist, mint.res/km.dist as dist_rel
from (select users.id as suggid, sqrt(pow(abs(users.lat - latc)*111,2) + pow(abs(users.lon - lonc)*111, 2)) as dist
from users right  
join (select id as client, lat as latc, lon as lonc from users where id = ?) as test 
	on 1 = 1 
where users.gender in (?, ?) and users.id < 800 and users.id != ?) as km
INNER JOIN (select min(dist) as res
from
(select users.id as suggid, sqrt(pow(abs(users.lat - latc)*111,2) + pow(abs(users.lon - lonc)*111, 2)) as dist
from users 
right join (select id as client, lat as latc, lon as lonc from users where id = ?) as test2 
	on 1 = 1 
where users.gender in (?, ?) and users.id < 800 and users.id != ?) as diff2) as mint
	on 1 = 1) as tab_dist
left join (select tags.user_id, tags.count as countsugg, tot.count as counttot, client.count as countclient, tags.count / ((tot.count + client.count)/2) as restag
from (select truc.user_id, count(client.tag_id) as count 
	from tag_user as client
inner join tag_user as truc 
	on client.tag_id = truc.tag_id
where client.user_id = ?
group by truc.user_id) as tags
INNER join (SELECT user_id, count(user_id) as count from tag_user group by user_id) as tot
	on tags.user_id = tot.user_id
INNER join (SELECT user_id, count(user_id) as count from tag_user group by user_id) as client
	on 1 = client.user_id) as tab_tag
on tab_dist.suggid = tab_tag.user_id
left join (select id, pop from users) as tab_pop
on tab_dist.sugg_id = tab_pop.id;







SELECT concat, suggid, dist_rel, restag, dist FROM (SELECT km.suggid, km.dist, mint.res/km.dist as dist_rel from (select users.id as suggid, sqrt(pow(abs(users.lat - latc)*111,2) + pow(abs(users.lon - lonc)*111, 2)) as dist from users right join (select id as client, lat as latc, lon as lonc from users where id = 11) as test on 1 = 1 
where users.gender in ("femme", "homme") and users.id < 800 and users.id != 11) as km INNER JOIN (select min(dist) as res
from (select users.id as suggid, sqrt(pow(abs(users.lat - latc)*111,2) + pow(abs(users.lon - lonc)*111, 2)) as dist
from users right join (select id as client, lat as latc, lon as lonc from users where id = 11) as test2 on 1 = 1 
where users.gender in ("femme", "homme") and users.id < 800 and users.id != 11) as diff2) as mint on 1 = 1) as tab_dist
left join (select concat, tags.user_id, tags.count as countsugg, tot.count as counttot, client.count as countclient, tags.count / ((tot.count + client.count)/2) as restag
from (select truc.user_id, count(client.tag_id) as count, GROUP_CONCAT(convert(client.tag_id, char) SEPARATOR ' ') as concat
	from tag_user as client inner join tag_user as truc on client.tag_id = truc.tag_id where client.user_id = 11
group by truc.user_id) as tags INNER join (SELECT user_id, count(user_id) as count from tag_user group by user_id) as tot
	on tags.user_id = tot.user_id INNER join (SELECT user_id, count(user_id) as count from tag_user group by user_id) as client
	on 1 = client.user_id) as tab_tag on tab_dist.suggid = tab_tag.user_id;



















