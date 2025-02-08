# Courier Chef Order Management System
Product Requirements Document (PRD)

## Product Overview
The Courier Chef Order Management System is a specialized application designed for kitchen staff to efficiently manage food delivery orders, organize them into delivery groups (baskets), and coordinate with delivery couriers. The system uses a Kanban-style interface to visualize and manage the entire order fulfillment process.

## Business Objectives
1. Streamline the order preparation and delivery process in commercial kitchens
2. Optimize courier efficiency by enabling logical grouping of orders
3. Provide real-time visibility into order status and courier assignments
4. Reduce delivery times through efficient order batching
5. Minimize errors in order handling and delivery assignments

## Core Entities

### Orders
- **Definition**: Individual customer orders containing one or more food items
- **Attributes**:
  - Unique ID
  - Delivery address
  - Payment method
  - Delivery time
  - Status (preparing, prepared, on_the_way, delivered)
  - Basket assignment (nullable)
  - Order items (array of items with id and name)
  - Restaurant information
  - Preparation time
  - Order time

### Baskets
- **Definition**: Logical grouping of orders for efficient delivery
- **Attributes**:
  - Unique ID
  - Assigned courier ID (nullable)
  - Status (prepared, on_the_way, delivered)
  - Array of order IDs
- **Business Rules**:
  - Must contain at least one order
  - Can only be assigned to one courier through a one-to-one relationship
  - Must contain orders with geographically proximate delivery addresses
  - When assigned to a courier, the courier's basket_id is updated to match this basket's ID

### Couriers
- **Definition**: Delivery personnel responsible for delivering order baskets
- **Attributes**:
  - Unique ID
  - Name
  - Basket ID (nullable)
- **Business Rules**:
  - Can only be assigned to one basket at a time through basket_id
  - Courier availability is determined by basket_id:
    - If basket_id is null: Courier is available for delivery
    - If basket_id is not null: Courier is currently delivering that basket
  - When assigned to a basket, both the basket's courier_id and the courier's basket_id must be updated atomically
  - When a basket is marked as delivered, the courier's basket_id is automatically set to null

## User Interface

### Layout
The interface follows a Kanban board design with three main columns, each featuring order count and sorting capabilities:

#### Column Header Structure
Each column header contains:
- Column title
- Order count indicator showing total number of contained orders
- Sorting controls with options for:
  - Order time (ascending/descending)
  - Preparation time (ascending/descending)
  - Restaurant name (alphabetical)
  - Delivery address (alphabetical)

#### 1. Preparing Column
- **Content**: Individual orders in preparation
- **Count Display**: Shows total number of orders being prepared
- **Display Elements**:
  - Order ID
  - Preparation timer
  - Order timestamp
  - Restaurant name
  - Payment method
  - Complete delivery address
- **Actions**:
  - Mark order as prepared
- **Sorting Options**:
  - By preparation time remaining
  - By order received time
  - By restaurant name

#### 2. On the Shelf Column
- **Organization**: Two sections
  - Top: Active baskets
  - Bottom: Unassigned prepared orders
- **Count Display**: 
  - Total orders in the column
  - Breakdown of basketed vs unbasked orders
- **Display Elements for Orders**:
  - All order information
  - Basket assignment options
- **Display Elements for Baskets**:
  - Basket ID
  - Contained orders
  - Courier assignment status
  - Available couriers dropdown (shows only couriers with null basket_id)
- **Actions**:
  - Create new basket
  - Add/remove orders from baskets
  - Assign available courier to basket
  - Delete basket
  - Move basket to "On The Way"
- **Sorting Options**:
  - By time since preparation completed
  - By delivery address proximity
  - By restaurant name

#### 3. On The Way Column
- **Content**: Active delivery baskets
- **Count Display**: 
  - Total orders in delivery
  - Active couriers count
- **Display Elements**:
  - Basket information
  - Assigned courier name
  - Contained orders
  - Delivery status
- **Actions**:
  - Mark orders as delivered
  - Mark basket as delivered (automatically frees assigned courier)
- **Sorting Options**:
  - By courier name
  - By delivery time
  - By number of orders in basket

### Top Navigation
- Application title
- Global order count display showing total orders in system
- Search functionality with fuzzy search capability for orders

## Core Functionality

### Order Management
1. **Order Creation**
   - Orders enter the system in "preparing" status
   - Automatically appear in Preparing column

2. **Order Preparation**
   - Kitchen staff can mark orders as "prepared"
   - Prepared orders move to On the Shelf column

3. **Basket Creation**
   - Two methods for creating baskets:
     - Create new basket with single order
     - Add order to existing basket
   - Orders can be removed from baskets if status is "prepared"

### Basket Management
1. **Basket Creation Rules**
   - Can be created with one or more orders
   - Orders should have proximate delivery addresses

2. **Courier Assignment**
   - Baskets can only be assigned to couriers with null basket_id
   - Assignment process:
     1. System checks courier availability (basket_id is null)
     2. Updates basket's courier_id and courier's basket_id in a single transaction
     3. Only after successful assignment can basket move to "On The Way" status
   - Assignment is final once basket is "On The Way"

3. **Basket State Transitions**
   - prepared → on_the_way (requires courier assignment)
   - on_the_way → delivered (all orders must be delivered, automatically nullifies courier's basket_id)

### Delivery Management
1. **Basket Delivery**
   - Baskets in "On The Way" status cannot be modified
   - Individual orders marked as delivered
   - When basket is marked as delivered:
     1. All contained orders are marked as delivered
     2. Assigned courier's basket_id is set to null
     3. Basket is removed from active view

2. **Status Updates**
   - Similar to real-time (polled) updates for order status changes
   - Automatic removal of completed baskets
   - Real-time updates of courier availability status

## Additional Notes on Column Management

### Column Order Persistence
- Column sorting preferences are preserved between sessions
- Each column maintains independent sorting preferences
- Default sorting can be configured per column:
  - Preparing: By preparation time remaining
  - On the Shelf: By time since preparation completed
  - On The Way: By delivery time

### Column Order Behavior
- Sort indicators visually show current sort direction
- Secondary sort options available for tie-breaking
- Sorting applies to:
  - Individual orders in Preparing column
  - Baskets and unassigned orders separately in On the Shelf column
  - Baskets in On The Way column

### Performance Considerations
- Client-side sorting for immediate response
- Debounced sort operations for large datasets
- Optimized re-rendering for sort operations

## Technical Requirements

### Frontend Technologies
- React as primary framework
- Optional integration with:
  - Ant Design for UI components
  - React Query for data management

### Backend Integration
- RESTful API integration
- JSON Server for development/testing

## Technical Considerations for Courier Management

### Data Consistency
1. **Atomic Operations**
   - Courier assignment must update both basket and courier records atomically
   - Database transactions should ensure data consistency
   - Optimistic locking to prevent concurrent assignment conflicts

2. **Status Validation**
   - Regular validation of courier-basket relationships
   - Automated cleanup of inconsistent states
   - Logging of all status changes for audit purposes

3. **API Requirements**
   - Endpoint for checking courier availability
   - Combined endpoint for courier-basket assignment
   - Status update notifications for courier availability changes

## Optional Enhancements

### User Experience
1. **Context Menus**
   - Quick actions for orders
   - Courier assignment shortcuts

2. **Animations and Transitions**
   - Status change animations
   - Basket creation/deletion effects
   - Hover states and interactive feedback

3. **Notifications**
   - Operation success/failure alerts
   - New order notifications
   - Courier assignment confirmations

### Additional Features
1. **Completed Orders Column**
   - Historical view of delivered orders
   - Delivery performance metrics

2. **Order Details Modal**
   - Detailed view of order information
   - Order history and status changes
   - Customer contact information

## Success Metrics
1. Order processing time
2. Average basket creation time
3. Delivery efficiency
4. Error rate in order handling
5. User satisfaction metrics

## Documentation Requirements
1. README file with:
   - Project setup instructions
   - Running instructions
   - Screenshots of key interfaces
   - Feature documentation
2. Code documentation
3. API integration documentation