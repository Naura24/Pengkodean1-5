// script.js
document.addEventListener('DOMContentLoaded', () => {
    fetchItems();
});

function fetchItems() {
    fetch('backend.php?action=getItems')
        .then(response => response.json())
        .then(data => {
            const tbody = document.getElementById('inventoryBody');
            tbody.innerHTML = '';
            data.forEach((item, index) => {
                const row = `
                    <tr>
                        <td>${index + 1}</td>
                        <td>${item.item_name}</td>
                        <td>${item.item_cost}</td>
                        <td>${item.description}</td>
                        <td>${item.quantity}</td>
                        <td>${item.available}</td>
                        <td>
                            <button class="issue-btn" onclick="issueItem(${item.id})">Issue Item</button>
                            <button class="edit-btn" onclick="showEditItemForm(${item.id}, '${item.item_name}', ${item.item_cost}, '${item.description}', ${item.quantity}, ${item.available})">Edit</button>
                            <button class="delete-btn" onclick="deleteItem(${item.id})">Delete</button>
                        </td>
                    </tr>
                `;
                tbody.innerHTML += row;
            });
        });
}

function searchItem() {
    const searchInput = document.getElementById('searchInput').value;
    fetch(`backend.php?action=searchItem&name=${searchInput}`)
        .then(response => response.json())
        .then(data => {
            const tbody = document.getElementById('inventoryBody');
            tbody.innerHTML = '';
            data.forEach((item, index) => {
                const row = `
                    <tr>
                        <td>${index + 1}</td>
                        <td>${item.item_name}</td>
                        <td>${item.item_cost}</td>
                        <td>${item.description}</td>
                        <td>${item.quantity}</td>
                        <td>${item.available}</td>
                        <td>
                            <button class="issue-btn" onclick="issueItem(${item.id})">Issue Item</button>
                            <button class="edit-btn" onclick="showEditItemForm(${item.id}, '${item.item_name}', ${item.item_cost}, '${item.description}', ${item.quantity}, ${item.available})">Edit</button>
                            <button class="delete-btn" onclick="deleteItem(${item.id})">Delete</button>
                        </td>
                    </tr>
                `;
                tbody.innerHTML += row;
            });
        });
}

function showAddItemForm() {
    const form = document.getElementById('addItemForm');
    form.style.display = form.style.display === 'none' ? 'block' : 'none';
    document.getElementById('editItemForm').style.display = 'none';
}

function addItem() {
    const itemName = document.getElementById('itemName').value;
    const itemCost = document.getElementById('itemCost').value;
    const description = document.getElementById('description').value;
    const quantity = document.getElementById('quantity').value;

    fetch('backend.php?action=addItem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            item_name: itemName,
            item_cost: itemCost,
            description: description,
            quantity: quantity,
            available: quantity
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            fetchItems();
            showAddItemForm();
        } else {
            alert('Failed to add item');
        }
    });
}

function showEditItemForm(id, name, cost, description, quantity, available) {
    document.getElementById('editItemId').value = id;
    document.getElementById('editItemName').value = name;
    document.getElementById('editItemCost').value = cost;
    document.getElementById('editDescription').value = description;
    document.getElementById('editQuantity').value = quantity;
    document.getElementById('editAvailable').value = available;

    const form = document.getElementById('editItemForm');
    form.style.display = 'block';
    document.getElementById('addItemForm').style.display = 'none';
}

function updateItem() {
    const id = document.getElementById('editItemId').value;
    const itemName = document.getElementById('editItemName').value;
    const itemCost = document.getElementById('editItemCost').value;
    const description = document.getElementById('editDescription').value;
    const quantity = document.getElementById('editQuantity').value;
    const available = document.getElementById('editAvailable').value;

    fetch('backend.php?action=updateItem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            id: id,
            item_name: itemName,
            item_cost: itemCost,
            description: description,
            quantity: quantity,
            available: available
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            fetchItems();
            document.getElementById('editItemForm').style.display = 'none';
        } else {
            alert('Failed to update item');
        }
    });
}

function deleteItem(id) {
    if (confirm('Are you sure you want to delete this item?')) {
        fetch(`backend.php?action=deleteItem&id=${id}`, { method: 'POST' })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    fetchItems();
                } else {
                    alert('Failed to delete item');
                }
            });
    }
}

function issueItem(id) {
    fetch(`backend.php?action=issueItem&id=${id}`, { method: 'POST' })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                fetchItems();
            } else {
                alert('Failed to issue item');
            }
        });
}