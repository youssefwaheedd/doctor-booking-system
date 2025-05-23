# UML Diagrams for Doctor Booking System

## Class Diagram (Database Schema)

```plantuml
@startuml Database Schema

' Entities
class profiles {
  +id: UUID
  +full_name: TEXT
  +role: TEXT
  +created_at: TIMESTAMPTZ
  +updated_at: TIMESTAMPTZ
}

class admin_settings {
  +id: UUID
  +admin_user_id: UUID
  +day_of_week: INTEGER
  +start_time: TIME
  +end_time: TIME
  +slot_duration_minutes: INTEGER
  +is_active: BOOLEAN
  +created_at: TIMESTAMPTZ
  +updated_at: TIMESTAMPTZ
}

class blocked_periods {
  +id: UUID
  +admin_user_id: UUID
  +start_datetime: TIMESTAMPTZ
  +end_datetime: TIMESTAMPTZ
  +reason: TEXT
  +created_at: TIMESTAMPTZ
  +updated_at: TIMESTAMPTZ
}

class appointments {
  +id: UUID
  +patient_user_id: UUID
  +admin_user_id: UUID
  +start_datetime: TIMESTAMPTZ
  +end_datetime: TIMESTAMPTZ
  +reason_for_visit: TEXT
  +status: TEXT
  +created_at: TIMESTAMPTZ
  +updated_at: TIMESTAMPTZ
}

' Relationships
profiles "1" -- "0..*" admin_settings : has
profiles "1" -- "0..*" blocked_periods : has
profiles "1" -- "0..*" appointments : has as patient
profiles "1" -- "0..*" appointments : has as admin

@enduml
```

## Activity Diagram (Application Flow)

```plantuml
@startuml Application Flow

start

:User visits website;

if (Is logged in?) then (no)
  :Show login/signup page;
  if (Has account?) then (no)
    :Sign up;
  else (yes)
    :Login;
  endif
endif

:Show dashboard;

if (User role?) then (patient)
  :Show patient dashboard;
  if (Want to book?) then (yes)
    :Select date;
    :Select time slot;
    :Enter reason;
    :Confirm booking;
  else (no)
    :View appointments;
    if (Want to cancel?) then (yes)
      :Cancel appointment;
    endif
  endif
else (admin)
  :Show admin dashboard;
  if (Want to manage schedule?) then (yes)
    :Set availability;
    :Block periods;
  else (no)
    :View appointments;
    if (Want to complete?) then (yes)
      :Mark as completed;
    endif
  endif
endif

stop

@enduml
```

## Sequence Diagram (Booking Process)

```plantuml
@startuml Booking Process

actor Patient
participant "Frontend" as FE
participant "Backend" as BE
database "Database" as DB

Patient -> FE: Select date
FE -> BE: Fetch available slots
BE -> DB: Query admin settings
DB --> BE: Return settings
BE --> FE: Return available slots

Patient -> FE: Select time slot
FE -> BE: Check slot availability
BE -> DB: Query appointments
DB --> BE: Return appointments
BE --> FE: Confirm availability

Patient -> FE: Enter reason & confirm
FE -> BE: Create appointment
BE -> DB: Insert appointment
DB --> BE: Confirm insertion
BE --> FE: Return success
FE --> Patient: Show confirmation

@enduml
```

## State Machine Diagram (Appointment States)

```plantuml
@startuml Appointment States

[*] --> Booked : Create appointment

state Booked {
  [*] --> Active : Created
  Active --> CancelledByPatient : Patient cancels
  Active --> CancelledByAdmin : Admin cancels
  Active --> Completed : Admin marks complete
}

state CancelledByPatient {
  [*] --> Cancelled : Patient cancels
}

state CancelledByAdmin {
  [*] --> Cancelled : Admin cancels
}

state Completed {
  [*] --> Done : Appointment completed
}

CancelledByPatient --> [*]
CancelledByAdmin --> [*]
Completed --> [*]

@enduml
```

## Use Case Diagrams

### Main System Use Cases

```plantuml
@startuml Main Use Cases

left to right direction
skinparam packageStyle rectangle

actor Patient
actor Admin
actor "System" as System

rectangle "Doctor Booking System" {
  usecase "Register Account" as UC1
  usecase "Login" as UC2
  usecase "Book Appointment" as UC3
  usecase "View Appointments" as UC4
  usecase "Cancel Appointment" as UC5
  usecase "Manage Availability" as UC6
  usecase "Block Time Periods" as UC7
  usecase "View Patient History" as UC8
  usecase "Complete Appointment" as UC9
  usecase "Send Notifications" as UC10
}

Patient --> UC1
Patient --> UC2
Patient --> UC3
Patient --> UC4
Patient --> UC5

Admin --> UC2
Admin --> UC6
Admin --> UC7
Admin --> UC8
Admin --> UC9

System --> UC10

@enduml
```

### Authentication Use Cases

```plantuml
@startuml Authentication Use Cases

left to right direction
skinparam packageStyle rectangle

actor User
actor "System" as System

rectangle "Authentication System" {
  usecase "Register" as UC1
  usecase "Login" as UC2
  usecase "Reset Password" as UC3
  usecase "Verify Email" as UC4
  usecase "Logout" as UC5
  usecase "Validate Credentials" as UC6
}

User --> UC1
User --> UC2
User --> UC3
User --> UC5

System --> UC4
System --> UC6

@enduml
```

## Flow of Events (Activity Diagrams)

### Registration Process

```plantuml
@startuml Registration Process

start

:Enter email and password;
:Enter personal information;

if (Email valid?) then (no)
  :Show email error;
  stop
else (yes)
endif

if (Password meets requirements?) then (no)
  :Show password requirements;
  stop
else (yes)
endif

:Create account;
:Send verification email;

if (Email verified?) then (no)
  :Show verification pending;
  stop
else (yes)
endif

:Create profile;
:Set role;
:Show success message;
:Redirect to dashboard;

stop

@enduml
```

### Appointment Booking Process

```plantuml
@startuml Appointment Booking Process

start

:Select date from calendar;

if (Date available?) then (no)
  :Show date unavailable;
  stop
else (yes)
endif

:Load available time slots;

if (Slots available?) then (no)
  :Show no slots available;
  stop
else (yes)
endif

:Select time slot;
:Enter reason for visit;

if (Slot still available?) then (no)
  :Show slot taken;
  stop
else (yes)
endif

:Confirm booking;
:Create appointment;
:Send confirmation;
:Update calendar;

stop

@enduml
```

## State Machine Diagrams for Main Functionalities

### Authentication State Machine

```plantuml
@startuml Authentication States

[*] --> LoggedOut

state LoggedOut {
  [*] --> EnteringCredentials
  EnteringCredentials --> Validating
  Validating --> LoggedIn : Success
  Validating --> Error : Failed
  Error --> EnteringCredentials : Retry
}

state LoggedIn {
  [*] --> Active
  Active --> SessionExpired : Timeout
  Active --> LoggedOut : Logout
  SessionExpired --> LoggedOut
}

LoggedIn --> [*]

@enduml
```

### Availability Management State Machine

```plantuml
@startuml Availability Management States

[*] --> Unconfigured

state Unconfigured {
  [*] --> SettingSchedule
  SettingSchedule --> Configured : Save
}

state Configured {
  [*] --> Active
  Active --> Blocked : Block period
  Active --> Modified : Update schedule
  Blocked --> Active : Unblock
  Modified --> Active : Save changes
}

Configured --> [*]

@enduml
```

## Detailed Class Diagram

```plantuml
@startuml Detailed Class Diagram

' User Management
class User {
  +id: UUID
  +email: TEXT
  +password_hash: TEXT
  +created_at: TIMESTAMPTZ
  +last_sign_in: TIMESTAMPTZ
  +is_verified: BOOLEAN
  +verify_email()
  +reset_password()
  +update_last_sign_in()
}

class Profile {
  +id: UUID
  +user_id: UUID
  +full_name: TEXT
  +role: TEXT
  +phone: TEXT
  +created_at: TIMESTAMPTZ
  +updated_at: TIMESTAMPTZ
  +update_profile()
  +get_role()
}

' Appointment Management
class Appointment {
  +id: UUID
  +patient_user_id: UUID
  +admin_user_id: UUID
  +start_datetime: TIMESTAMPTZ
  +end_datetime: TIMESTAMPTZ
  +reason_for_visit: TEXT
  +status: TEXT
  +created_at: TIMESTAMPTZ
  +updated_at: TIMESTAMPTZ
  +book()
  +cancel()
  +complete()
  +reschedule()
}

class AdminSettings {
  +id: UUID
  +admin_user_id: UUID
  +day_of_week: INTEGER
  +start_time: TIME
  +end_time: TIME
  +slot_duration_minutes: INTEGER
  +is_active: BOOLEAN
  +created_at: TIMESTAMPTZ
  +updated_at: TIMESTAMPTZ
  +update_settings()
  +get_available_slots()
  +is_time_available()
}

class BlockedPeriod {
  +id: UUID
  +admin_user_id: UUID
  +start_datetime: TIMESTAMPTZ
  +end_datetime: TIMESTAMPTZ
  +reason: TEXT
  +created_at: TIMESTAMPTZ
  +updated_at: TIMESTAMPTZ
  +block_period()
  +unblock_period()
  +is_period_blocked()
}

' Notifications
class Notification {
  +id: UUID
  +user_id: UUID
  +type: TEXT
  +message: TEXT
  +is_read: BOOLEAN
  +created_at: TIMESTAMPTZ
  +send()
  +mark_as_read()
}

' Relationships
User "1" -- "1" Profile : has
User "1" -- "0..*" Appointment : books
User "1" -- "0..*" AdminSettings : manages
User "1" -- "0..*" BlockedPeriod : creates
User "1" -- "0..*" Notification : receives
Appointment "1" -- "1" User : belongs to patient
Appointment "1" -- "1" User : belongs to admin
AdminSettings "1" -- "1" User : belongs to
BlockedPeriod "1" -- "1" User : belongs to

@enduml
```

## How to Use These Diagrams

1. Install PlantUML extension in your IDE or use an online PlantUML editor
2. Copy the diagram code you want to view
3. Paste it into the PlantUML editor
4. The diagram will be generated automatically

Note: These diagrams are generated using PlantUML syntax. You can modify them by editing the code blocks above.
