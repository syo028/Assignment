select
  request_log.id
, datetime(request_log.timestamp/1000+8*60*60,'unixepoch') as timestamp
, method.method
, url.url
, user.username
, user_agent.user_agent
from request_log
inner join method on request_log.method_id = method.id
inner join url on request_log.url_id = url.id
left join user on request_log.user_id = user.id
left join user_agent on request_log.user_agent_id = user_agent.id
