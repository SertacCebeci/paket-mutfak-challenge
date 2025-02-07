# Courier Chef Order Managament App

## Description
This application is specifically designed for courier chefs in kitchens that are tasked with checking orders, order contents, baskets and couriers

## Core Entities

### Courier
The person that is tasked with taking out orders from the kitchen and delivering them to the customers

#### Example of Courier
<code>
{ "id": "3", "name": "Duhan Günsel" }
</code>

### Order
- Contains one or more items that is requested by customer
- It contains the information about delivery adress and ordering time
- has the status of preparing, prepared, on_the_way, and delivered
- has many to one relationship with basket

#### Example of Order
<code>
{
    "id": "1",
    "address": "Kadıköy, İstanbul, Turkey, Sahte Sokak, No: 123 Daire: 4",
    "payment": "Credit Card",
    "delivery_time": "2024-12-24T23:59:59Z",
    "status": "preparing",
    "basket_id": null,
    "items": [
        { "id": "1", "name": "Şerifali Köfte" },
        { "id": "2", "name": "Mercimek Çorbası" }
    ]
},
</code>

### Basket
when courier comes to the kitchen they usually take more than one order in order to maximize courier efficieny. a basket is prepared by the courier chef depending on the orders delivery adress location. usually orders that contain close enough delivery adresses grouped together to make a basket

- grouping of one or more orders
- this contains orders that are required to be assigned to a courier
- has the status of, prepared, on_the_way, delivered
- it has one to many connection with orders

#### Example of Basket
<code>
{
    "id": "1",
    "courier_id": "1",
    "status": "on_the_way",
    "orders": [1, 2]
}
</code>

## Features
This application will take a form similar to a <b>Kanban Board</b> with three columns.

### Columns
The Kanban Board columns are Preparing, On the Shelf, and On The Way. Preparing column can only contain orders cards. on the shelf column can contain a mixture of baskets and orders. on the way column should only contain baskets.

on the shelf column displays the baskets at the top leaving orders taht are not basketed on the bottom

### Order Card
Visualizes inforamtion about an order. It has several action buttons depending on which column and state order is in. If an order is in preparing state, it will have a button to mark it as prepared. If an order is in prepared state and not in a basket, it will have a button create a new basket and add this order to it and a selection to add the order to an exisisting prepared basket. If an order is in a basket, it will have a button to remove it from the basket. If an order is in a basket.

### Basket Card
Visualizes information about a basket. Mainly contains the order card that are in the basket. 

If a basket is prepared it will have a selection of couriers to assign a courier
If a basket is perpared, assigned to a courier, and has atleast one order than It will has a button to mark it as on the way
If a basket is on the way, it will have a button to mark it as delivered
A basket that is prepared also has a button that will delete the basket and remove all orders from it

## Behaviors

When an order's status becomes preparing
Then order is moved to the preparing column
Then order has a button to mark it as prepared

When mark it as prepared button is clicked
Then order's status is changed to prepared
And order is moved to the on the shelf column
And order has a basket select with options "create a basket" and all the existing on shelf basket_ids, like
- create a basket
- add to basket_1
- add to basket_2
...
And an order has a button to add to baske


If an order that is not basketed and on shelf exists
When order's basket select is "create a basket"
And order's "add to basket" button is clicked
Then a new basket empty basket is created
{
    id: <uuid>
    courier_id: null,
    status: "prepared",
    orders: []
}
Then order is added to the basket
{
    id: <uuid>
    courier_id: null,
    status: "prepared",
    orders: [<uuid_of_the_order>]
}
Then the order's basket_id field is assigned to created basket's id
{
    "id": "1",
    "address": "Kadıköy, İstanbul, Turkey, Sahte Sokak, No: 123 Daire: 4",
    "payment": "Credit Card",
    "delivery_time": "2024-12-24T23:59:59Z",
    "status": "prepared",
    "basket_id": <created_basket_id>,
    "items": [
        { "id": "1", "name": "Şerifali Köfte" },
        { "id": "2", "name": "Mercimek Çorbası" }
    ]
},
Then basket is rendered under the on the shelf column with order inside of it


If an order that is not basketed and on the shelf exists
When basket selection is "add to <basket_1>"
Then order is added to <basket_1>
And orders basket_id is updated to <basket_1>
And order is rendered under basket

When an order is in a basket
Then order is moved to the basket card
Then order has a button to remove from the basket

When remove from the basket button is clicked
Then order is removed from the basket
Then order is moved to the on the shelf column

When a basket is prepared
Then it has a button to delete the basket

When delete the basket button is clicked
and basket has orders inside
Then orders are placed under on the shelf
and orders basket_id is null 
and basket is deleted

When a basket is prepared
Then basket is moved to the on the shelf column
Then basket has a selection to assign a courier

When a courier is assigned to a basket
and basket has atleast one order
Then basket has a button to move on the way

When a basket is on the way
Then basket has a button to mark as delivered

When an order is on the way
Then it has no actions (an order that is on the way cannot be moved out of the basket)

When mark it as delivered button is clicked
Then basket is removed from the on the way column
