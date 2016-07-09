'use strict';


var SlotMachine = function() {
  var slots = [];
  this.init = function() {
    let $container1 = $('#slot-1 > .item-container');
    let $container2 = $('#slot-2 > .item-container');
    let $container3 = $('#slot-3 > .item-container');

    let slot1 = new Slot($container1, ['Coffee Maker', 'Teapot', 'Espresso Machine'], 500);
    let slot2 = new Slot($container2, ['Coffee Filter', 'Tea Strainer', 'Espresso Tamper'], 250);
    let slot3 = new Slot($container3, ['Coffee Grounds', 'Loose Tea', 'Ground Espresso Beans'], 125);

    slots.push(slot1);
    slots.push(slot2);
    slots.push(slot3);

    $($container1).append('<div style="color: #C86428">' + slot1.items[0] + '</div>');
    $($container1).append('<div style="color: #08A242">' + slot1.items[1] + '</div>');
    $($container1).append('<div style="color: #552000">' + slot1.items[2] + '</div>');

    $($container2).append('<div style="color: #C86428">' + slot2.items[0] + '</div>');
    $($container2).append('<div style="color: #08A242">' + slot2.items[1] + '</div>');
    $($container2).append('<div style="color: #552000">' + slot2.items[2] + '</div>');

    $($container3).append('<div style="color: #C86428">' + slot3.items[0] + '</div>');
    $($container3).append('<div style="color: #08A242">' + slot3.items[1] + '</div>');
    $($container3).append('<div style="color: #552000">' + slot3.items[2] + '</div>');
  };
  this.start = function() {
    let slot1 = slots[0];
    let slot2 = slots[1];
    let slot3 = slots[2];

    slot1.start();
    slot2.start();
    slot3.start();
  };
};

var Slot = function(container, items, interval) {
  this.items = items;
  var isRunning = false;
  var $container = container;
  var interval = interval;

  this.start = function() {
    isRunning = true;
    $container.velocity({top: -100}, 'linear', interval, () => {
      this.runSlot(interval);
    });
    window.setTimeout(function() {
      isRunning = false;
    }, 5000 + interval + (interval));
  };
  this.runSlot = function() {
    if (isRunning) {
      let $firstEl = $container.find('div:first-child');
      $container.append($firstEl);
      $container.css({top: 100});
      $container.velocity({top: -100}, 'linear', interval, () => {
        $container.append($firstEl);
        this.runSlot(interval);
      });
    } else {
      this.stopSlot();
    }
  };
  this.stopSlot = function() {
    // Bounce effect on stop
    $container.velocity({top: 15}, 'ease-out', 200);
    $container.velocity({top: -10}, 'ease-out', 250);
    $container.velocity({top: 5}, 'ease-out', 125);
    $container.velocity({top: -2}, 'ease-out', 100);
    $container.velocity({top: 0}, 'ease-out', 100);
  };
};

$(document).ready(function() {
  var slotMachine = new SlotMachine();
  slotMachine.init();

  $('.lever').click(function() {
    slotMachine.start();
  });
});
