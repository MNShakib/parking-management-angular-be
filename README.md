"# parking-management-project" 
✅ API Base URL
ts
Copy
Edit
const API_BASE_URL = 'http://localhost:5000/api';
✅ Endpoints Overview
🔐 Auth

Operation	URL	Method	Body
Register User	/auth/register	POST	{ username, password }
Login	/auth/login	POST	{ username, password }
👤 User Operations

Operation	URL	Method	Notes
View Slots	/user/slots	GET	Requires Bearer Token
Book a Slot	/user/book/:slotId	POST	Requires Bearer Token
🛠 Admin Operations

Operation	URL	Method	Body
Create Car Slots	/admin/create-car-slots	POST	{ numberOfSlots }
Create Bike Slots	/admin/create-bike-slots	POST	{ numberOfSlots }
✅ Authorization
Add JWT token in HTTP Headers:

ts
Copy
Edit
headers: {
  Authorization: `Bearer ${token}`
}
✅ Angular Services Example (Skeleton)
auth.service.ts
ts
Copy
Edit
login(data: any): Observable<any> {
  return this.http.post(`${API_BASE_URL}/auth/login`, data);
}
user.service.ts
ts
Copy
Edit
getAllSlots(): Observable<any> {
  return this.http.get(`${API_BASE_URL}/user/slots`, {
    headers: { Authorization: `Bearer ${token}` }
  });
}
admin.service.ts
ts
Copy
Edit
createCarSlots(count: number): Observable<any> {
  return this.http.post(`${API_BASE_URL}/admin/create-car-slots`, { numberOfSlots: count }, {
    headers: { Authorization: `Bearer ${token}` }
  });
}
✅ Suggested Angular Structure
services/

auth.service.ts

user.service.ts

admin.service.ts

components/

login/, register/, dashboard/, admin-panel/, etc.

