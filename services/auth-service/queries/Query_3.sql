select name, count(*) as count from countries
group by name
having count(*)>1