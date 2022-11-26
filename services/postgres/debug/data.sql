INSERT INTO public.category (id,"name", description) VALUES
    (1,'Household supplies','sample text sample text sample text'),
    (2,'Computer parts','Lorem Ipsum lores im damet'),
    (3,'Building materials','');

INSERT INTO public."user" (id,username,"password",email,"name",balance,tax_id) VALUES
    (1,'neterpila1','my_password','neterpila1@foo.bar','Neterpila_1',123.23,NULL),
    (2,'neterpila2','my_password','neterpila2@foo.bar','Neterpila_2',234.23,NULL);

INSERT INTO public.item (id,"name",description,owner_id,price,quantity) VALUES
    (1,'Cegła (szt.)','Cegła zwykła',2,0.80,90),
    (2,'NVIDIA RTX 3090Ti','uuuuu',2,2983.00,2);

INSERT INTO public."order" (id,paid,delivery_address) VALUES
    (1,false,'Kraków, ul. Kowala Kowalskiego 12b');

INSERT INTO public.order_content (order_id,item_id,quantity) VALUES
    (1,1,23),
    (1,2,1);