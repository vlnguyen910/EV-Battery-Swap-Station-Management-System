# Swapping a Battery at a Station Workflow

```mermaid
gantt
    dateFormat  YYYY-MM-DD
    title Swapping a Battery at a Station Workflow
    excludes weekdays 2024-01-01

    section EV Driver
    Start                       :a1, 2024-01-01, 1d
    Search for station          :a2, after a1, 1d
    Make reservation            :a3, after a2, 1d
    Check for available battery :a4, after a3, 1d
    Check for available package :a5, after a4, 1d
    Register package            :a6, after a5, 1d
    Make payment                :a7, after a6, 1d
    View swap history           :a8, after a7, 1d

    section System
    Display nearby stations     :b1, after a2, 1d
    Confirm reservation         :b2, after a4, 1d
    Record transaction          :b3, after b2, 1d
    Payment success?            :b4, after a7, 1d
    Update history              :b5, after b4, 1d
    Send history information    :b6, after b5, 1d

    section Station Staff
    Inform driver               :c1, after b2, 1d
    Check compatible battery    :c2, after b2, 1d
    Swap battery                :c3, after c2, 1d
    Record payment              :c4, after c3, 1d

    section Admin
    Update inventory            :d1, after c3, 1d
    Review reports              :d2, after d1, 1d