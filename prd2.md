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
  - Can only be assigned to one courier
  - Must contain orders with geographically proximate delivery addresses

### Couriers
- **Definition**: Delivery personnel responsible for delivering order baskets
- **Attributes**:
  - Unique ID
  - Name
  - Current status

## User Interface

### Layout
The interface follows a Kanban board design with three main columns:

#### 1. Preparing Column
- **Content**: Individual orders in preparation
- **Display Elements**:
  - Order ID
  - Preparation timer
  - Order timestamp
  - Restaurant name
  - Payment method
  - Complete delivery address
- **Actions**:
  - Mark order as prepared

#### 2. On the Shelf Column
- **Organization**: Two sections
  - Top: Active baskets
  - Bottom: Unassigned prepared orders
- **Display Elements for Orders**:
  - All order information
  - Basket assignment options
- **Display Elements for Baskets**:
  - Basket ID
  - Contained orders
  - Courier assignment status
- **Actions**:
  - Create new basket
  - Add/remove orders from baskets
  - Assign courier to basket
  - Delete basket
  - Move basket to "On The Way"

#### 3. On The Way Column
- **Content**: Active delivery baskets
- **Display Elements**:
  - Basket information
  - Assigned courier
  - Contained orders
  - Delivery status
- **Actions**:
  - Mark orders as delivered
  - Mark basket as delivered (when all orders complete)

### Top Navigation
- Application title
- Order count display
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
   - Baskets must be assigned a courier before moving to "On The Way"
   - Courier assignment is final once basket is "On The Way"

3. **Basket State Transitions**
   - prepared → on_the_way (requires courier assignment)
   - on_the_way → delivered (all orders must be delivered)

### Delivery Management
1. **Basket Delivery**
   - Baskets in "On The Way" status cannot be modified
   - Individual orders marked as delivered
   - Basket automatically marked as delivered when all orders complete

2. **Status Updates**
   - Similar to real-time (polled) updates for order status changes
   - Automatic removal of completed baskets

## Technical Requirements

### Frontend Technologies
- React as primary framework
- Optional integration with:
  - Ant Design for UI components
  - React Query for data management

### Backend Integration
- RESTful API integration
- JSON Server for development/testing

## Optional Enhancements

### User Experience

2. **Context Menus**
   - Quick actions for orders
   - Courier assignment shortcuts

3. **Animations and Transitions**
   - Status change animations
   - Basket creation/deletion effects
   - Hover states and interactive feedback

4. **Notifications**
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