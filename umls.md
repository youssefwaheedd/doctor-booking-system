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

## How to Use These Diagrams

1. Install PlantUML extension in your IDE or use an online PlantUML editor
2. Copy the diagram code you want to view
3. Paste it into the PlantUML editor
4. The diagram will be generated automatically

Note: These diagrams are generated using PlantUML syntax. You can modify them by editing the code blocks above.
