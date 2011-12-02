var EVENT_TYPE = "test";

var DispatcherTest = new Class ({
	
	Extends: PyrTestCase

	,name: "DispatcherTest"
	,dispatcher: null
	,count: 0
	,handlerSuccessBound: null
	,handlerFailureBound: null
	,handlerIncreaseCountBound: null
	,handlerPrioritySecondBound: null

	,initialize: function() {
		this.handlerSuccessBound = this.handlerSuccess.bind(this);
		this.handlerFailureBound = this.handlerFailure.bind(this);
		this.handlerIncreaseCountBound = this.handlerIncreaseCount.bind(this);
		this.handlerPrioritySecondBound = this.handlerPrioritySecond.bind(this);
	}

	,setUp: function() {
		this.dispatcher = new soma.EventDispatcher;
		this.count = 0;
	}

	,tearDown: function() {
		this.dispatcher.dispose();
		this.dispatcher = null;
	}

	,handlerEmpty: function(event) {
		
	}

	,handlerSuccess: function(event) {
		this.assertTrue(true);
	}

	,handlerFailure: function(event) {
		this.assertFalse(true);
	}

	,handlerIncreaseCount: function(event) {
		this.count++;
	}

	,handlerPrioritySecond: function(event) {
		this.assertEquals(this.count, 1);
	}

	,test_single_create_dispatcher: function() {
		this.assertNotNull(this.dispatcher);
		this.assertInstanceOf(soma.EventDispatcher, this.dispatcher);
	}

	,test_multiple_create_dispatcher: function() {
		var dispatcher1 = new soma.EventDispatcher;
		var dispatcher2 = new soma.EventDispatcher;
		this.assertNotNull(dispatcher1);
		this.assertNotNull(dispatcher2);
		this.assertInstanceOf(soma.EventDispatcher, dispatcher1);
		this.assertInstanceOf(soma.EventDispatcher, dispatcher2);
		this.assertAreNotSame(dispatcher1, dispatcher2);
	}

	,test_single_add_listener: function() {
		this.dispatcher.addEventListener(EVENT_TYPE, this.handlerSuccessBound);
		this.dispatcher.dispatchEvent(new soma.Event(EVENT_TYPE));
	}

	,test_multiple_add_listener: function() {
		this.dispatcher.addEventListener(EVENT_TYPE, this.handlerSuccessBound);
		this.dispatcher.addEventListener(EVENT_TYPE, this.handlerSuccessBound);
		this.dispatcher.addEventListener(EVENT_TYPE, this.handlerSuccessBound);
		this.dispatcher.dispatchEvent(new soma.Event(EVENT_TYPE));
	}

	,test_add_listener_with_different_type: function() {
		this.dispatcher.addEventListener(EVENT_TYPE, this.handlerIncreaseCountBound);
		this.dispatcher.addEventListener('other', this.handlerIncreaseCountBound);
		this.dispatcher.dispatchEvent(new soma.Event(EVENT_TYPE));
		this.assertEquals(this.count, 1);
	}

	,test_add_listener_with_different_handler: function() {
		this.dispatcher.addEventListener(EVENT_TYPE, this.handlerIncreaseCountBound);
		this.dispatcher.addEventListener(EVENT_TYPE, this.handlerEmpty);
		this.dispatcher.dispatchEvent(new soma.Event(EVENT_TYPE));
		this.assertEquals(this.count, 1);
	}

	,test_multiple_add_listener: function() {
		this.dispatcher.addEventListener(EVENT_TYPE, this.handlerSuccessBound);
		this.dispatcher.addEventListener(EVENT_TYPE, this.handlerSuccessBound);
		this.dispatcher.addEventListener(EVENT_TYPE, this.handlerSuccessBound);
		this.dispatcher.dispatchEvent(new soma.Event(EVENT_TYPE));
	}

	,test_single_has_listener: function() {
		this.dispatcher.addEventListener(EVENT_TYPE, this.handlerEmpty);
		this.assertTrue(this.dispatcher.hasEventListener(EVENT_TYPE));
	}

	,test_multiple_has_listener: function() {
		this.dispatcher.addEventListener(EVENT_TYPE, this.handlerEmpty);
		this.dispatcher.addEventListener(EVENT_TYPE, this.handlerEmpty);
		this.dispatcher.addEventListener(EVENT_TYPE, this.handlerEmpty);
		this.assertTrue(this.dispatcher.hasEventListener(EVENT_TYPE));
	}

	,test_multiple_has_listener_with_different_type: function() {
		this.dispatcher.addEventListener(EVENT_TYPE, this.handlerEmpty);
		this.dispatcher.addEventListener('other', this.handlerEmpty);
		this.assertTrue(this.dispatcher.hasEventListener(EVENT_TYPE));
	}

	,test_multiple_has_listener_with_different_handler: function() {
		this.dispatcher.addEventListener(EVENT_TYPE, this.handlerIncreaseCountBound);
		this.dispatcher.addEventListener(EVENT_TYPE, this.handlerEmpty);
		this.assertTrue(this.dispatcher.hasEventListener(EVENT_TYPE));
	}

	,test_single_remove_listener: function() {
		this.dispatcher.addEventListener(EVENT_TYPE, this.handlerEmpty);
		this.dispatcher.removeEventListener(EVENT_TYPE, this.handlerEmpty);
		this.assertFalse(this.dispatcher.hasEventListener(EVENT_TYPE));
	}

	,test_multiple_remove_listener: function() {
		this.dispatcher.addEventListener(EVENT_TYPE, this.handlerEmpty);
		this.dispatcher.addEventListener(EVENT_TYPE, this.handlerEmpty);
		this.dispatcher.removeEventListener(EVENT_TYPE, this.handlerEmpty);
		this.dispatcher.removeEventListener(EVENT_TYPE, this.handlerEmpty);
		this.assertFalse(this.dispatcher.hasEventListener(EVENT_TYPE));
	}

	,test_multiple_remove_listener_should_fail: function() {
		this.dispatcher.addEventListener(EVENT_TYPE, this.handlerEmpty);
		this.dispatcher.addEventListener(EVENT_TYPE, this.handlerEmpty);
		this.dispatcher.removeEventListener(EVENT_TYPE, this.handlerEmpty);
		this.assertTrue(this.dispatcher.hasEventListener(EVENT_TYPE));
	}

	,test_single_remove_listener_does_not_dispatch: function() {
		this.dispatcher.addEventListener(EVENT_TYPE, this.handlerFailureBound);
		this.dispatcher.removeEventListener(EVENT_TYPE, this.handlerFailureBound);
		this.dispatcher.dispatchEvent(new soma.Event(EVENT_TYPE));
		this.assertTrue(true);
	}

	,test_multiple_remove_listener_does_not_dispatch: function() {
		this.dispatcher.addEventListener(EVENT_TYPE, this.handlerFailureBound);
		this.dispatcher.addEventListener(EVENT_TYPE, this.handlerFailureBound);
		this.dispatcher.removeEventListener(EVENT_TYPE, this.handlerFailureBound);
		this.dispatcher.removeEventListener(EVENT_TYPE, this.handlerFailureBound);
		this.dispatcher.dispatchEvent(new soma.Event(EVENT_TYPE));
		this.assertTrue(true);
	}

	,test_remove_listener_with_different_type: function() {
		this.dispatcher.addEventListener(EVENT_TYPE, this.handlerSuccessBound);
		this.dispatcher.removeEventListener('other', this.handlerEmpty);
		this.dispatcher.dispatchEvent(new soma.Event(EVENT_TYPE));
	}

	,test_remove_listener_with_different_handler: function() {
		this.dispatcher.addEventListener(EVENT_TYPE, this.handlerSuccessBound);
		this.dispatcher.removeEventListener(EVENT_TYPE, this.handlerEmpty);
		this.dispatcher.dispatchEvent(new soma.Event(EVENT_TYPE));
	}

	,test_single_dispatch: function() {
		this.dispatcher.addEventListener(EVENT_TYPE, this.handlerIncreaseCountBound);
		this.dispatcher.dispatchEvent(new soma.Event(EVENT_TYPE));
		this.assertEquals(this.count, 1);
	}

	,test_multiple_dispatch: function() {
		this.dispatcher.addEventListener(EVENT_TYPE, this.handlerIncreaseCountBound);
		this.dispatcher.dispatchEvent(new soma.Event(EVENT_TYPE));
		this.dispatcher.dispatchEvent(new soma.Event(EVENT_TYPE));
		this.dispatcher.dispatchEvent(new soma.Event(EVENT_TYPE));
		this.assertEquals(this.count, 3);
	}

	,test_dispatch_with_different_type: function() {
		this.dispatcher.addEventListener(EVENT_TYPE, this.handlerIncreaseCountBound);
		this.dispatcher.addEventListener(EVENT_TYPE, this.handlerIncreaseCountBound);
		this.dispatcher.dispatchEvent(new soma.Event(EVENT_TYPE));
		this.dispatcher.dispatchEvent(new soma.Event('other'));
		this.assertEquals(this.count, 2);
	}

	,test_priority_default: function() {
		this.dispatcher.addEventListener(EVENT_TYPE, this.handlerIncreaseCountBound);
		this.dispatcher.addEventListener(EVENT_TYPE, this.handlerPrioritySecondBound);
		this.dispatcher.dispatchEvent(new soma.Event(EVENT_TYPE));
	}
	
	,test_priority_positive: function() {
		this.dispatcher.addEventListener(EVENT_TYPE, this.handlerPrioritySecondBound);
		this.dispatcher.addEventListener(EVENT_TYPE, this.handlerIncreaseCountBound, 1);
		this.dispatcher.dispatchEvent(new soma.Event(EVENT_TYPE));
	}

	,test_priority_negative: function() {
		this.dispatcher.addEventListener(EVENT_TYPE, this.handlerIncreaseCountBound);
		this.dispatcher.addEventListener(EVENT_TYPE, this.handlerPrioritySecondBound, -1);
		this.dispatcher.dispatchEvent(new soma.Event(EVENT_TYPE));
	}

	,test_priority_positive_and_negative: function() {
		this.dispatcher.addEventListener(EVENT_TYPE, this.handlerIncreaseCountBound, 1);
		this.dispatcher.addEventListener(EVENT_TYPE, this.handlerPrioritySecondBound, -1);
		this.dispatcher.dispatchEvent(new soma.Event(EVENT_TYPE));
	}

	,test_dispose: function() {
		var dispatcher = new soma.EventDispatcher;
		dispatcher.addEventListener(EVENT_TYPE, this.handlerFailureBound);
		dispatcher.dispose();
		dispatcher.addEventListener(EVENT_TYPE, this.handlerFailureBound);
		dispatcher.hasEventListener(EVENT_TYPE);
		dispatcher.dispatchEvent(new soma.Event(EVENT_TYPE));
		dispatcher.removeEventListener(EVENT_TYPE, this.handlerEmpty);
		this.assertFalse(dispatcher.hasEventListener(EVENT_TYPE));
	}


});


