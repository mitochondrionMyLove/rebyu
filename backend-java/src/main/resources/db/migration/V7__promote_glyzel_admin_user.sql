insert into user_types (user_type_text)
select 'ADMIN'
where not exists (
    select 1
    from user_types
    where upper(user_type_text) = 'ADMIN'
);

insert into users (
    user_type_id,
    email,
    password_hash,
    account_status,
    joined_at
)
select
    (
        select user_type_id
        from user_types
        where upper(user_type_text) = 'ADMIN'
        order by user_type_id
        limit 1
    ),
    'glyzelgalagar123@gmail.com',
    'COGNITO',
    'active',
    now()
where not exists (
    select 1
    from users
    where lower(email) = 'glyzelgalagar123@gmail.com'
);

update users
set user_type_id = (
    select user_type_id
    from user_types
    where upper(user_type_text) = 'ADMIN'
    order by user_type_id
    limit 1
)
where lower(email) = 'glyzelgalagar123@gmail.com';
