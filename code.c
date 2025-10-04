#include <stdio.h>
#include <string.h>

#define MAX 100   // maximum jobs

// Job structure
struct Job {
    int id;
    char name[50];
    int priority;
};

struct Job jobQueue[MAX];
int jobCount = 0;
int jobCounter = 1;

// Add job (insert in sorted order by priority)
void addJob() {
    if (jobCount >= MAX) {
        printf("⚠ Queue full! Cannot add more jobs.\n");
        return;
    }
    struct Job j;
    j.id = jobCounter++;
    getchar();  
    printf("Enter Job Name: ");
    fgets(j.name, sizeof(j.name), stdin);
    j.name[strcspn(j.name, "\n")] = '\0'; // remove newline

    printf("Enter Priority (higher number = higher priority): ");
    scanf("%d", &j.priority);

    // insert job in correct position
    int i = jobCount - 1;
    while (i >= 0 && jobQueue[i].priority < j.priority) {
        jobQueue[i + 1] = jobQueue[i];
        i--;
    }
    jobQueue[i + 1] = j;
    jobCount++;

    printf("✅ Job added!\n");
}

// Display jobs
void displayJobs() {
    if (jobCount == 0) {
        printf("⚠ No jobs in queue.\n");
        return;
    }
    printf("\n--- Job Queue ---\n");
    for (int i = 0; i < jobCount; i++) {
        printf("ID: %d | Name: %s | Priority: %d\n",
               jobQueue[i].id,
               jobQueue[i].name,
               jobQueue[i].priority);
    }
    printf("-----------------\n");
}

// Execute next job
void executeJob() {
    if (jobCount == 0) {
        printf("⚠ No jobs to execute.\n");
        return;
    }
    struct Job j = jobQueue[0];

    // shift jobs left
    for (int i = 1; i < jobCount; i++) {
        jobQueue[i - 1] = jobQueue[i];
    }
    jobCount--;

    printf("🚀 Exeuting Job ID: %d (%s) with Priority %d\n",
           j.id, j.name, j.priority);
}

void main() {
    int choice;
    do {
        printf("\n--- Job Scheduling System ---\n");
        printf("1. Add Job\n2. Display Jobs\n3. Execute Next Josb\n4. Exit\n");
        printf("Enter choice: ");
        scanf("%d", &choice);

        switch (choice) {
            case 1: addJob(); break;
            case 2: displayJobs(); break;
            case 3: executeJob(); break;
            case 4: printf("Exiting...\n"); break;
            default: printf("Invalid choice.\n");
        }
    } while (choice != 4);

    
}